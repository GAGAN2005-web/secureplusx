import React from "react";
import { motion } from "framer-motion";
import ProjectOverviewCard from "../components/ProjectOverviewCard";
import FeatureCard from "../components/FeatureCard";
import { useNavigate } from "react-router-dom";

const features = [
  { title: "Passive Header Analysis", description: "Detects missing or weak security HTTP headers (CSP, HSTS, X-Frame-Options)." },
  { title: "Cookie Safety Check", description: "Inspects Set-Cookie attributes for HttpOnly, Secure, and SameSite flags." },
  { title: "Mixed Content Detector", description: "Finds resources loaded over HTTP on HTTPS pages (mixed content issues)." },
  { title: "Exposed Data Finder", description: "Looks for emails and obvious secrets in HTML content." },
  { title: "Form & CSRF Heuristics", description: "Checks forms for presence of CSRF-like tokens (heuristic)." },
  { title: "Inline Script Detector", description: "Flags inline scripts and event handler attributes that increase XSS risk." },
  { title: "Outdated Component Heuristics", description: "Heuristically detects possible outdated third-party libraries in script srcs." },
  { title: "SSL/TLS Basic Check", description: "Verifies if site uses HTTPS and flags missing TLS usage." },
  { title: "Report Generation", description: "Creates downloadable JSON & PDF reports saved to server history." },
  { title: "Safe Mode & Simulated Demo", description: "Simulated scans for demos; safe passive mode for real scans." },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
    

      <motion.section className="text-center mt-12 px-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-cyan-400">CyberPulse Scanner</h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Passive security insights and downloadable reports. Designed for safe, ethical scans and developer education.
        </p>
      </motion.section>

      <ProjectOverviewCard />

      <motion.div className="max-w-6xl mx-auto mt-8 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {features.map((f, idx) => (
          <FeatureCard key={idx} index={idx} title={f.title} description={f.description} />
        ))}
      </motion.div>

      <div className="text-center mt-12 pb-12">
        <button
          onClick={() => navigate("/scan")}
          className="px-8 py-3 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 shadow-lg shadow-cyan-500/30 transition-all"
        >
           Start Scan
        </button>
      </div>
    </div>
  );
};

export default Home;
