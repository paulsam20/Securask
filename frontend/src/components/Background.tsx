import React from "react";

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Pure white base */}
      <div className="absolute inset-0 bg-white" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #c8c8c8 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle radial fade so edges feel softer */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(255,255,255,0.6) 100%)",
        }}
      />
    </div>
  );
};
