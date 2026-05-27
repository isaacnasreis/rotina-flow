import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, History, Clock } from "lucide-react";
import { getDictionary } from "@/i18n/server";
import { ENERGY_TAGS } from "@/lib/constants";

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  const dict = await getDictionary();

  if (!userId) {
    redirect("/login");
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Fetch only completed tasks from previous days
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      isCompleted: true,
      createdAt: {
        lt: startOfToday, // only tasks created before today
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Group tasks by Date (updatedAt)
  const groupedTasks: Record<string, typeof tasks> = {};
  tasks.forEach(task => {
    // Format to "24 de Maio", "Ontem", etc.
    const date = new Date(task.updatedAt);
    const dateKey = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    
    // Check if it's today or yesterday
    const isToday = startOfToday.toDateString() === date.toDateString();
    const isYesterday = new Date(startOfToday.getTime() - 86400000).toDateString() === date.toDateString();
    const finalKey = isToday ? "Hoje, " + dateKey : isYesterday ? "Ontem, " + dateKey : dateKey;

    if (!groupedTasks[finalKey]) groupedTasks[finalKey] = [];
    groupedTasks[finalKey].push(task);
  });

  const getTag = (id: string) => ENERGY_TAGS.find(t => t.id === id);
  const formatTime = (date: Date | null | undefined) => 
    date ? new Date(date).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }) : "";

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
              {dict.history.title}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {tasks.length} {dict.dashboard.completed} {dict.history.completedPast}
            </p>
          </div>
        </header>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center mb-4">
              <History className="text-text-muted" size={24} />
            </div>
            <h3 className="text-lg font-medium text-text-primary">{dict.history.emptyState}</h3>
            <p className="text-sm text-text-muted mt-2 max-w-[240px]">
              {dict.history.emptyDescription}
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
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tagData.bg} ${tagData.text}`}>
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
