"use client";

import { DynamicBackground } from "@/components/layout/DynamicBackground";
import Link from "next/link";
import { ArrowLeft, Check, History, Clock } from "lucide-react";
import { ENERGY_TAGS } from "@/lib/constants";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function HistoryPage() {
  const t = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  // No Next.js, window pode ser undefined no primeiro render
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    setMounted(true);
    if (!userId) {
      window.location.href = "/login";
    }
  }, [userId]);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const tasks = useLiveQuery(() => {
    if (!userId) return [];
    return db.tasks
      .where("userId")
      .equals(userId)
      .filter((t) => t.isCompleted && t.syncStatus !== "deleted" && new Date(t.createdAt) < startOfToday)
      .reverse()
      .sortBy("updatedAt");
  }, [userId]) || [];

  const groupedTasks: Record<string, typeof tasks> = {};
  tasks.forEach((task) => {
    const date = new Date(task.updatedAt);
    const dateKey = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const isToday = startOfToday.toDateString() === date.toDateString();
    const isYesterday = new Date(startOfToday.getTime() - 86400000).toDateString() === date.toDateString();
    const finalKey = isToday ? "Hoje, " + dateKey : isYesterday ? "Ontem, " + dateKey : dateKey;

    if (!groupedTasks[finalKey]) groupedTasks[finalKey] = [];
    groupedTasks[finalKey].push(task);
  });

  const getTag = (id: string) => ENERGY_TAGS.find((t) => t.id === id);
  const formatTime = (date: Date | null | undefined | string) =>
    date ? new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";

  if (!mounted || !userId) return null;

  return (
    <>
      <DynamicBackground />

      <section className="pt-8 pb-20 max-w-lg mx-auto">
        <header className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-bg-card-hover text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              {t.history.title}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {tasks.length} {t.dashboard.completed} {t.history.completedPast}
            </p>
          </div>
        </header>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center mb-4">
              <History className="text-text-muted" size={24} />
            </div>
            <h3 className="text-lg font-medium text-text-primary">{t.history.emptyState}</h3>
            <p className="text-sm text-text-muted mt-2 max-w-[240px]">
              {t.history.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([date, dateTasks], groupIndex) => (
              <div
                key={date}
                className="animate-fade-in"
                style={{ animationDelay: `${groupIndex * 100}ms` }}
              >
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 sticky top-4 bg-bg-primary/80 backdrop-blur-md py-2 z-10">
                  {date}
                </h2>
                <div className="space-y-2">
                  {dateTasks.map((task, i) => {
                    const tagData = task.category ? getTag(task.category) : null;
                    const hasTimeInfo = task.startTime || task.endTime;
                    return (
                      <div
                        key={task.id}
                        className="group flex items-center gap-4 py-4 px-5 rounded-2xl bg-bg-card border border-border-subtle hover:border-glass-border transition-all animate-fade-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent border-2 border-accent flex items-center justify-center">
                          <Check size={12} className="text-bg-primary" strokeWidth={3} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[15px] font-medium leading-snug truncate block text-text-primary">
                            {task.title}
                          </span>

                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {hasTimeInfo && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-text-muted font-mono">
                                <Clock size={10} className="opacity-50" />
                                {formatTime(task.startTime)}
                                {task.endTime && ` - ${formatTime(task.endTime)}`}
                              </span>
                            )}
                            {tagData && (
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tagData.bg} ${tagData.text}`}
                              >
                                {tagData.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
