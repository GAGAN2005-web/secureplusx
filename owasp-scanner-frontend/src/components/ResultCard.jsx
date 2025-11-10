// frontend/src/components/ResultCard.jsx
import React from "react";
import { ShieldAlert, Bug, ShieldCheck, AlertTriangle } from "lucide-react";

const ResultCard = ({ vulnerability }) => {
  // 🔹 Match all real-world severity names (Critical, High, Medium, Low)
  const getSeverityColor = (level) => {
    switch (level) {
      case "Critical": return "text-red-500";
      case "High": return "text-orange-400";
      case "Medium": return "text-yellow-400";
      case "Low": return "text-green-400";
      case "Severe": return "text-red-400"; // backward compatibility
      case "Moderate": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  // 🔹 Choose icons dynamically for clarity
  const getSeverityIcon = (level) => {
    switch (level) {
      case "Critical": return ShieldAlert;
      case "High": return AlertTriangle;
      case "Medium": return Bug;
      case "Low": return ShieldCheck;
      case "Severe": return ShieldAlert;
      case "Moderate": return Bug;
      default: return ShieldCheck;
    }
  };

  const Icon = getSeverityIcon(vulnerability.severity);

  return (
    <div className="bg-[#0a0a0a] border border-cyan-500/20 rounded-xl p-5 shadow-md hover:shadow-cyan-400/20 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${getSeverityColor(vulnerability.severity)}`} />
          <h3 className="text-lg font-semibold text-cyan-300">{vulnerability.name}</h3>
        </div>

        <span
          className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(vulnerability.severity)} bg-white/5`}
        >
          {vulnerability.severity}
        </span>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">{vulnerability.description}</p>
      <p className="text-gray-500 text-xs mt-3">
        🛠 <span className="text-gray-300">Recommendation:</span> {vulnerability.recommendation}
      </p>
    </div>
  );
};

export default ResultCard;
