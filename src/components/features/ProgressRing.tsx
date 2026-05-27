"use client";

interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
}

export function ProgressRing({ completed, total, size = 100 }: ProgressRingProps) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total === 0 ? 0 : completed / total;
  const dashOffset = circumference - progress * circumference;
  const isAllDone = total > 0 && completed === total;

  const progressColor = isAllDone
    ? "#22c55e"
    : progress > 0.5
      ? "#a855f7"
      : "#6366f1";

  return (
    <div className={`relative inline-flex items-center justify-center ${isAllDone ? "animate-celebrate" : ""}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        {total > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="progress-ring-circle"
            style={{
              filter: isAllDone ? `drop-shadow(0 0 6px ${progressColor})` : "none",
            }}
          />
        )}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums leading-none">
          {completed}
          <span className="text-white/25 text-sm font-normal">/{total}</span>
        </span>
        {total > 0 && (
          <span className="text-[10px] text-white/30 font-medium mt-1 uppercase tracking-wider">
            {isAllDone ? "completo!" : "feitas"}
          </span>
        )}
      </div>
    </div>
  );
}
