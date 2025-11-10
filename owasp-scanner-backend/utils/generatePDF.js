const PDFDocument = require("pdfkit");
const fs = require("fs");

async function generatePDF(report, filepath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    doc.fontSize(20).fillColor("#00ffff").text("OWASP Vulnerability Scan Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).fillColor("white").text(`Target URL: ${report.url}`);
    doc.text(`Timestamp: ${report.timestamp}`);
    doc.text(`Security Score: ${report.score}/100`);
    doc.moveDown();

    report.vulnerabilities.forEach((vuln, i) => {
      doc.fontSize(14).fillColor("#00ffff").text(`${i + 1}. ${vuln.name}`);
      doc.fontSize(12).fillColor("white").text(`Severity: ${vuln.severity}`);
      doc.text(`Description: ${vuln.description}`);
      doc.text(`Recommendation: ${vuln.recommendation}`);
      doc.moveDown();
    });

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
}

module.exports = { generatePDF };
