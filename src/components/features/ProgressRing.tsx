"use client";

interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
}

export function ProgressRing({ completed, total, size = 100 }: ProgressRingProps) {
  const strokeWidth = 4.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total === 0 ? 0 : completed / total;
  const dashOffset = circumference - progress * circumference;
  const isAllDone = total > 0 && completed === total;
  const isEmpty = total === 0;

  const progressColor = isAllDone
    ? "var(--success)"
    : progress > 0.65
      ? "var(--accent)"
      : progress > 0
        ? "var(--accent)"
        : "var(--border-subtle)";

  const trackOpacity = isEmpty ? 0.4 : 1;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${isAllDone ? "animate-celebrate" : ""}`}
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${completed} de ${total} tarefas concluídas`}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Trilha de fundo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
          opacity={trackOpacity}
        />
        {/* Progresso */}
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
              filter: isAllDone
                ? `drop-shadow(0 0 8px var(--success))`
                : progress > 0
                  ? `drop-shadow(0 0 3px var(--accent-glow))`
                  : "none",
            }}
          />
        )}
      </svg>

      {/* Texto central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums leading-none text-text-primary">
          {completed}
          <span className="text-text-muted text-sm font-normal">/{total}</span>
        </span>
        {total > 0 && (
          <span
            className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${
              isAllDone ? "text-success animate-gentle-pulse" : "text-text-muted"
            }`}
          >
            {isAllDone ? "✓ Tudo!" : "feitas"}
          </span>
        )}
      </div>
    </div>
  );
}
