import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bug, ShieldOff, FileText, Zap } from "lucide-react";

const icons = [Bug, ShieldOff, FileText, Zap];

const FeatureCard = ({ title, description, index }) => {
  const [flipped, setFlipped] = useState(false);
  const Icon = icons[index % icons.length];

  return (
    <div
      className="relative w-full h-[180px] cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="absolute w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 bg-[#111] border border-cyan-500/20 rounded-xl p-5 flex flex-col items-center justify-center [backface-visibility:hidden]">
          <Icon className="w-8 h-8 text-cyan-400 mb-2" />
          <h3 className="text-lg font-semibold text-cyan-300">{title}</h3>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 bg-[#0a0a0a] border border-cyan-400/20 rounded-xl p-4 flex items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureCard;
