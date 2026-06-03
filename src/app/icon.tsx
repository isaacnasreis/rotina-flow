import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// Image metadata for the browser favicon
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Dynamic Icon generator
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          border: "1px solid rgba(168, 85, 247, 0.2)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Smooth Infinity-like Mobius Path with custom Bezier curves matching Logo.tsx */}
          <path
            d="M 28 50 C 28 36, 42 26, 50 50 C 58 74, 72 64, 72 50 C 72 36, 58 26, 50 50 C 42 74, 28 64, 28 50 Z"
            stroke="#a855f7"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core center circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="7" 
            fill="#ffffff" 
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
