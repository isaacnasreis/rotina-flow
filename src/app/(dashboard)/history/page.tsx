import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ENERGY_TAGS } from "@/lib/constants";

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;

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

  return (
    <>
      <DynamicBackground />

      <section className="pt-8 pb-20">
        <header className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white/90">
              Minhas Conquistas
            </h2>
            <p className="text-sm text-white/30 mt-1">
              {tasks.length} {tasks.length === 1 ? "tarefa concluída" : "tarefas concluídas"} no passado
            </p>
          </div>
        </header>

        {Object.keys(groupedTasks).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 mb-4 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/[0.05]">
              <CheckCircle2 size={24} className="text-white/20" />
            </div>
            <h3 className="text-lg font-medium text-white/80 mb-2">Nenhum histórico ainda</h3>
            <p className="text-[13px] text-white/40 max-w-[250px] mx-auto leading-relaxed">
              Suas tarefas concluídas em dias anteriores aparecerão aqui como um arquivo de conquistas.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([dateLabel, dayTasks], groupIndex) => (
              <div 
                key={dateLabel} 
                className="animate-fade-in"
                style={{ animationDelay: `${groupIndex * 100}ms` }}
              >
                <div className="flex items-center gap-3 py-2 mb-3">
                  <span className="text-[11px] uppercase tracking-widest text-white/30 font-bold capitalize">
                    {dateLabel}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.04]" />
                </div>
                
                <div className="space-y-1.5">
                  {dayTasks.map((task) => {
                    const tag = task.category ? getTag(task.category) : null;
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.015] border border-white/[0.03]"
                      >
                        <div className="relative flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                          <CheckCircle2 size={10} className="text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[14px] text-white/60 font-medium truncate block">
                            {task.title}
                          </span>
                          {tag && (
                            <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${tag.bg} ${tag.text} opacity-60`}>
                              {tag.label}
                            </span>
                          )}
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
