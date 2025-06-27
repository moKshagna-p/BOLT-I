import React from "react";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Main purple gradient beam */}
      <div
        className="absolute inset-0 rotate-45 opacity-40"
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
          <h1 className="text-3xl font-bold text-gray-100">Analytics</h1>
          <p className="mt-4 text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
