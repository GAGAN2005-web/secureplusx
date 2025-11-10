// backend/utils/passiveScan.js
const axios = require("axios");
const cheerio = require("cheerio");

const SAFE_USER_AGENT = "CyberPulse-Scanner/1.0 (+https://example.com)";

// Helper to push vuln with severity mapping
function pushVuln(list, name, severity, description, recommendation) {
  list.push({ name, severity, description, recommendation });
}

// Passive checks covering the 9 feature areas
async function passiveScan(targetUrl) {
  const vulnerabilities = [];

  try {
    // normalize URL
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = "http://" + targetUrl;

    const res = await axios.get(targetUrl, {
      headers: { "User-Agent": SAFE_USER_AGENT },
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: null,
    });

    const html = typeof res.data === "string" ? res.data : "";
    const headers = res.headers || {};
    const $ = cheerio.load(html);

    // 1) Passive Header Analysis (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
    const missingHeaders = [];
    if (!headers["content-security-policy"]) missingHeaders.push("Content-Security-Policy");
    if (!headers["strict-transport-security"]) missingHeaders.push("Strict-Transport-Security");
    if (!headers["x-frame-options"]) missingHeaders.push("X-Frame-Options");
    if (!headers["x-content-type-options"]) missingHeaders.push("X-Content-Type-Options");
    if (missingHeaders.length) {
      // severity depends on criticality
      const sev = missingHeaders.includes("Content-Security-Policy") ? "Moderate" : "Low";
      pushVuln(
        vulnerabilities,
        "Missing Security Headers",
        sev,
        `Missing headers: ${missingHeaders.join(", ")}`,
        "Add recommended headers: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options."
      );
    }

    // 2) Cookie Safety Check (HttpOnly, Secure, SameSite)
    const setCookies = headers["set-cookie"] || [];
    if (setCookies.length) {
      setCookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0];
        if (!/httponly/i.test(cookie)) {
          pushVuln(
            vulnerabilities,
            `Cookie without HttpOnly: ${cookieName}`,
            "Low",
            `Cookie '${cookieName}' missing HttpOnly attribute.`,
            "Set the HttpOnly flag to help mitigate client-side script access."
          );
        }
        if (!/secure/i.test(cookie)) {
          pushVuln(
            vulnerabilities,
            `Cookie without Secure: ${cookieName}`,
            "Moderate",
            `Cookie '${cookieName}' missing Secure attribute (sent over non-HTTPS).`,
            "Ensure cookies use the Secure flag and site uses HTTPS."
          );
        }
        if (!/samesite/i.test(cookie)) {
          pushVuln(
            vulnerabilities,
            `Cookie without SameSite: ${cookieName}`,
            "Low",
            `Cookie '${cookieName}' missing SameSite attribute.`,
            "Consider setting SameSite=Lax or Strict where appropriate."
          );
        }
      });
    }

    // 3) Mixed Content Detector
    if (/^https:/i.test(targetUrl)) {
      const mixedCount = (html.match(/src=["']http:/gi) || []).length + (html.match(/href=["']http:/gi) || []).length;
      if (mixedCount > 0) {
        pushVuln(
          vulnerabilities,
          "Mixed Content Resources",
          "Moderate",
          `Found ${mixedCount} resources loaded over HTTP on an HTTPS page.`,
          "Serve all resources over HTTPS to avoid man-in-the-middle risks."
        );
      }
    } else {
      // Not using HTTPS at all
      pushVuln(
        vulnerabilities,
        "No HTTPS/TLS",
        "Severe",
        "Site not served over HTTPS; traffic may be unencrypted.",
        "Enable HTTPS with a valid TLS certificate (Let’s Encrypt or equivalent)."
      );
    }

    // 4) Exposed Data Finder (emails, obvious secrets)
    const text = $.root().text();
    const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) || [];
    if (emails.length) {
      pushVuln(
        vulnerabilities,
        "Exposed Emails / Data in HTML",
        "Low",
        `Found ${emails.length} email addresses in page text (public exposure).`,
        "Remove or obfuscate email addresses or move them to server-side contacts to avoid scraping."
      );
    }
    // basic secret patterns (very heuristic)
    const secretPatterns = html.match(/api[_-]?key|secret|password|client[_-]?secret/gi) || [];
    if (secretPatterns.length) {
      pushVuln(
        vulnerabilities,
        "Possible Exposed Secrets in HTML",
        "Severe",
        "Found strings that may indicate API keys or secrets in page content or source.",
        "Remove secrets from client-side code and store them server-side or in environment variables."
      );
    }

    // 5) Form & CSRF Heuristics
    const forms = $("form");
    if (forms.length > 0) {
      let formsMissingCsrf = 0;
      forms.each((i, form) => {
        const hasToken = $(form).find("input[name*='csrf'], input[name*='token'], input[name*='csrf_token']").length > 0;
        if (!hasToken) formsMissingCsrf++;
      });
      if (formsMissingCsrf > 0) {
        pushVuln(
          vulnerabilities,
          "Forms without CSRF protections",
          "Moderate",
          `${formsMissingCsrf} form(s) appear to lack obvious CSRF tokens (heuristic).`,
          "Implement CSRF tokens or same-site protections for state-changing requests."
        );
      }
    }

    // 6) Inline Scripts / Event Handlers (XSS risk surface)
    const inlineScriptCount = $("script:not([src])").length;
    const eventHandlerCount = $("*[onload],[onerror],[onclick],[onmouseover],[onfocus]").length;
    if (inlineScriptCount > 0 || eventHandlerCount > 0) {
      const sev = inlineScriptCount > 0 ? "Moderate" : "Low";
      pushVuln(
        vulnerabilities,
        "Inline Scripts / Event Handlers",
        sev,
        `Inline scripts: ${inlineScriptCount}, inline event handlers: ${eventHandlerCount}.`,
        "Avoid inline JS and use external scripts; use CSP to reduce XSS impact."
      );
    }

    // 7) Outdated Component Heuristics (check script srcs for known patterns)
    const scriptSrcs = $("script[src]").map((i, s) => $(s).attr("src")).get().join(" ");
    const outdatedFindings = [];
    if (/jquery[-.](1\.|2\.)/i.test(scriptSrcs)) outdatedFindings.push("Possible old jQuery version");
    if (/angular\.js/i.test(scriptSrcs) && /\/1\.\d/.test(scriptSrcs)) outdatedFindings.push("Possible old AngularJS");
    if (outdatedFindings.length) {
      pushVuln(
        vulnerabilities,
        "Potential Outdated Libraries",
        "Low",
        outdatedFindings.join("; "),
        "Create an inventory of third-party libs and update to secure versions."
      );
    }

    // 8) SSL/TLS Basic Check — we already checked for HTTPS; we can detect redirect to HTTPS or not
    // (Advanced cert checks would require extra libs—kept simple)
    if (res.request && res.request.res && res.request.res.socket) {
      const isEncrypted = /^https:/i.test(targetUrl);
      // if it is https and responded OK, ok. (skip deep TLS checks here)
    }

    // 9) Report Generation readiness: check for server error leakage
    if (/exception|stack trace|traceback|sql syntax error|mysql|ora-|warning:/i.test(html)) {
      pushVuln(
        vulnerabilities,
        "Server Error / Stack Trace Disclosure",
        "Moderate",
        "Page content contains patterns that resemble stack traces or DB error messages.",
        "Hide detailed error messages from users; log them server-side instead."
      );
    }

    // Final: compute score by severity weights
    // Severe: -25, Moderate: -15, Low: -5
    let score = 100;
    vulnerabilities.forEach((v) => {
      if (v.severity === "Severe") score -= 25;
      else if (v.severity === "Moderate") score -= 15;
      else score -= 5;
    });
    if (score < 0) score = 0;

    return {
      url: targetUrl,
      score,
      vulnerabilities,
    };
  } catch (err) {
    // network or fetch error
    return {
      url: targetUrl,
      score: 0,
      vulnerabilities: [
        {
          name: "Scan Failed",
          severity: "Severe",
          description: `Failed to fetch target: ${err.message || "unknown error"}`,
          recommendation: "Verify the URL is reachable, publicly accessible, and not blocking requests.",
        },
      ],
    };
  }
}

module.exports = passiveScan;
