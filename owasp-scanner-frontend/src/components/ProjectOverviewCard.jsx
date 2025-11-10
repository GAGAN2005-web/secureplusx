import React, { useState } from "react";
import { motion } from "framer-motion";
import { Info, AlertTriangle } from "lucide-react";

const ProjectOverviewCard = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-[360px] h-[240px] mx-auto mt-10 cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="absolute w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 bg-[#111] border border-cyan-500/30 rounded-2xl shadow-lg flex flex-col justify-center items-center p-6 [backface-visibility:hidden]">
          <Info className="w-12 h-12 text-cyan-400 mb-3" />
          <h2 className="text-2xl font-bold text-cyan-300">About This Project</h2>
          <p className="text-gray-400 text-sm mt-2 text-center">
            CyberPulse Scanner provides safe, passive security checks and reporting for public websites.
          </p>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 bg-[#0a0a0a] border border-cyan-400/30 rounded-2xl shadow-lg p-5 flex flex-col justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h3 className="text-cyan-300 font-semibold mb-2 text-lg">What this tool does</h3>
          <ul className="text-gray-300 text-sm leading-relaxed list-disc ml-5">
            <li>Performs non-intrusive GET-only checks (headers, cookies, HTML content).</li>
            <li>Generates downloadable JSON & PDF reports and stores history.</li>
            <li>Includes a simulated demo mode for UI/testing.</li>
            <li>Does NOT run destructive or exploitative tests by default.</li>
          </ul>

          <div className="mt-3 text-xs text-yellow-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Use responsibly — scan only sites you own or have permission to test.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectOverviewCard;
