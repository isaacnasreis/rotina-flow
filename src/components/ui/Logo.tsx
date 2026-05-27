import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | number;
  className?: string;
  withText?: boolean;
}

export function Logo({ size = "md", className = "", withText = true }: LogoProps) {
  const sizeMap = {
    sm: 28,
    md: 36,
    lg: 56,
  };
  
  const iconSize = typeof size === "number" ? size : sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Animated Glowing Wave/Infinity SVG */}
      <div className="relative flex items-center justify-center">
        {/* Glowing backdrop blur */}
        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-110 animate-pulse duration-[3000ms]"></div>
        
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-transform duration-500 hover:scale-105"
        >
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8b4fe" /> {/* Light purple */}
              <stop offset="50%" stopColor="#a855f7" /> {/* Purple-500 */}
              <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
            </linearGradient>
            <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Smooth Infinity-like Mobius Path with custom Bezier curves */}
          <path
            d="M 28 50 C 28 36, 42 26, 50 50 C 58 74, 72 64, 72 50 C 72 36, 58 26, 50 50 C 42 74, 28 64, 28 50 Z"
            stroke="url(#flowGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core pulsing center circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="5" 
            fill="url(#coreGrad)" 
            className="animate-ping"
            style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>

      {withText && (
        <h1
          className={`font-black tracking-tighter uppercase italic text-white leading-none ${
            size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : "text-2xl"
          }`}
        >
          Rotina <span className="text-purple-500">Flow</span>
        </h1>
      )}
    </div>
  );
}
