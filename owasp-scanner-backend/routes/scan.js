// backend/routes/scan.js
const express = require("express");
const router = express.Router();
const passiveScan = require("../utils/passiveScan");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// Ensure reports directory exists
const reportsDir = path.join(__dirname, "..", "reports");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

router.post("/", async (req, res) => {
  const { url, apiKey, consent } = req.body;

  // Basic API key & consent checks
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized — invalid API key" });
  }
  if (consent !== true) {
    return res.status(400).json({ error: "Consent required to perform scan" });
  }
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const scanResult = await passiveScan(url);

    // Build report object
    const timestamp = new Date().toISOString();
    const report = {
      url: scanResult.url,
      timestamp,
      score: scanResult.score,
      vulnerabilities: scanResult.vulnerabilities,
    };

    // Save JSON
    const filename = `scan_${Date.now()}`;
    const jsonPath = `/reports/${filename}.json`;
    const pdfPath = `/reports/${filename}.pdf`;
    fs.writeFileSync(path.join(reportsDir, `${filename}.json`), JSON.stringify(report, null, 2));

    // Generate PDF
    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(path.join(reportsDir, `${filename}.pdf`));
      doc.pipe(stream);

      doc.fillColor("#00ffff").fontSize(18).text("CyberPulse Scanner Report", { align: "center" });
      doc.moveDown();
      doc.fillColor("white").fontSize(11).text(`Target: ${report.url}`);
      doc.text(`Timestamp: ${report.timestamp}`);
      doc.text(`Security Score: ${report.score} / 100`);
      doc.moveDown();

      if (report.vulnerabilities.length === 0) {
        doc.fillColor("green").text("No vulnerabilities detected by passive checks.", { continued: false });
      } else {
        report.vulnerabilities.forEach((v, i) => {
          doc.moveDown(0.5);
          // severity styling
          let sevColor = "white";
          if (v.severity === "Severe") sevColor = "red";
          else if (v.severity === "Moderate") sevColor = "yellow";
          else sevColor = "green";

          doc.fillColor(sevColor).fontSize(13).text(`${i + 1}. ${v.name} [${v.severity}]`);
          doc.fillColor("white").fontSize(10).text(`Description: ${v.description}`);
          doc.text(`Recommendation: ${v.recommendation}`);
        });
      }

      doc.end();
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Return report metadata + data
    res.json({
      url: report.url,
      score: report.score,
      vulnerabilities: report.vulnerabilities,
      jsonReport: jsonPath,
      pdfReport: pdfPath,
    });
  } catch (err) {
    console.error("scan route error:", err);
    res.status(500).json({ error: "Scan failed", details: err.message });
  }
});

module.exports = router;
