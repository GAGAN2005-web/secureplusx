import React from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#0d0d0d] border-b border-cyan-500/20">
      <div className="flex items-center space-x-3">
        <Shield className="text-cyan-400 w-6 h-6" />
        <div>
          <h1 className="text-xl font-semibold text-cyan-300">CyberPulse Scanner</h1>
          <div className="text-xs text-gray-400">Passive Security Insights — Safe · Ethical · Non-intrusive</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
        <Link to="/scan" className="text-cyan-400 font-medium hover:underline">Start Scan</Link>
      </div>
    </nav>
  );
};

export default Navbar;