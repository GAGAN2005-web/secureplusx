import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-[#1a1a1a] rounded-full h-4 overflow-hidden shadow-inner mt-4">
      <motion.div
        className="h-4 bg-gradient-to-r from-cyan-400 to-blue-500"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
};

export default ProgressBar;
