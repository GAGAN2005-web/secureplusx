const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const path = require("path");
const scanRoutes = require("./routes/scan");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" })); // react dev origin
app.use(bodyParser.json());

// Serve static reports
app.use("/reports", express.static(path.join(__dirname, "reports")));

// Rate limiting (simple)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests, try again later." },
});
app.use("/api/scan", limiter);

// Scan route
app.use("/api/scan", scanRoutes);

// simple root
app.get("/", (req, res) => res.send("CyberPulse Scanner backend running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
