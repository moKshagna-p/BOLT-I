import React from "react";
import { motion } from "framer-motion";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Main purple gradient beam */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 rotate-45"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #6B21A8 50%, transparent 100%)",
          filter: "blur(80px)",
          transform: "translateY(-50%) rotate(-45deg) scale(2)",
        }}
      />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-[#121212]/50 backdrop-blur-[1px]" />

      {/* Content wrapper */}
      <div className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-gray-100"
          >
            Analytics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-gray-400"
          >
            Coming soon...
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
