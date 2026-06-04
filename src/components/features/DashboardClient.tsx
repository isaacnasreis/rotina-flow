"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, LocalTask } from "@/lib/db";
import { QuickInput } from "@/components/features/QuickInput";
import { TaskItem } from "@/components/features/TaskItem";
import { ProgressRing } from "@/components/features/ProgressRing";
import { EmptyState } from "@/components/features/EmptyState";
import { DashboardActions } from "@/components/features/DashboardActions";
import { useEffect, useState } from "react";
import { useSync } from "@/hooks/useSync";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

export function DashboardClient() {
  const router = useRouter();
  const dict = useTranslation();
  useSync();
  const [mounted, setMounted] = useState(false);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    setMounted(true);
    if (!userId) {
      router.replace("/login");
    }
  }, [userId, router]);


  const localTasks = useLiveQuery(
    () => {
      if (!userId) return [];
      return db.tasks.where('userId').equals(userId).filter(t => t.syncStatus !== 'deleted').reverse().sortBy('createdAt');
    },
    [userId]
  );

  const tasks = localTasks || [];

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Filtrar e formatar as tarefas conforme a regra de negócios
  const mappedTasks = tasks.map((task) => {
    const startTime = task.startTime ? new Date(task.startTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : undefined;
    const endTime = task.endTime ? new Date(task.endTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : undefined;
    
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      startTime,
      endTime,
      isCompleted: task.isCompleted,
      category: task.category,
      blockId: task.blockId,
      createdAt: task.createdAt,
      syncStatus: task.syncStatus // Podemos usar isso para mostrar um ícone de nuvem cortada
    };
  });

  // Custom sorting logic
  mappedTasks.sort((a, b) => {
    if (a.startTime && !b.startTime) return -1;
    if (!a.startTime && b.startTime) return 1;
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    const isARolledOver = new Date(a.createdAt) < startOfDay;
    const isBRolledOver = new Date(b.createdAt) < startOfDay;
    if (isARolledOver && !isBRolledOver) return -1;
    if (!isARolledOver && isBRolledOver) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const completedCount = mappedTasks.filter((t) => t.isCompleted).length;
  const totalCount = mappedTasks.length;
  const pendingTasks = mappedTasks.filter((t) => !t.isCompleted);
  const completedTasks = mappedTasks.filter((t) => t.isCompleted);

  const rolledOverTasks = pendingTasks.filter(t => new Date(t.createdAt) < startOfDay);
  const todaysPendingTasks = pendingTasks.filter(t => new Date(t.createdAt) >= startOfDay);

  return (
    <>
      <section className="pt-8 pb-32 max-w-lg mx-auto px-4 md:px-0">
        <header className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-text-primary leading-tight">
              {dict.dashboard.title}
            </h1>
            <p className="text-text-secondary mt-1">
              <span className="text-accent font-semibold">{completedCount}</span> {dict.dashboard.completed}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing completed={completedCount} total={totalCount} size={64} />
            <DashboardActions />
          </div>
        </header>

        {/* Guilt-Free Rollover Banner */}
        {rolledOverTasks.length > 0 && (
          <div className="mb-8 p-4 bg-accent/10 border border-accent/20 rounded-2xl animate-fade-in-up">
            <div className="flex items-start gap-3">
              <div className="text-accent text-xl mt-0.5">🍃</div>
              <div className="flex-1">
                <h3 className="text-text-primary font-medium text-sm">
                  Olá! Algumas tarefas ficaram para trás.
                </h3>
                <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                  Tudo bem não dar conta de tudo! Você tem {rolledOverTasks.length} tarefas flexíveis de ontem. Deseja trazê-las para hoje ou simplesmente deixá-las ir?
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button 
                    onClick={async () => {
                      for (const t of rolledOverTasks) {
                        await db.tasks.update(t.id, { 
                          createdAt: new Date(), 
                          updatedAt: new Date(),
                          syncStatus: 'updated'
                        });
                      }
                    }}
                    className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors"
                  >
                    Tentar Hoje
                  </button>
                  <button 
                    onClick={async () => {
                      for (const t of rolledOverTasks) {
                        await db.tasks.update(t.id, { 
                          isCompleted: true, 
                          updatedAt: new Date(),
                          syncStatus: 'updated'
                        });
                      }
                    }}
                    className="px-3 py-1.5 bg-white/5 text-text-secondary hover:text-text-primary text-xs font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Deixar Ir (Concluir)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        {totalCount === 0 && !localTasks ? (
           <div className="animate-pulse flex flex-col gap-4">
              <div className="h-16 bg-white/5 rounded-2xl w-full"></div>
              <div className="h-16 bg-white/5 rounded-2xl w-full"></div>
           </div>
        ) : totalCount === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-1.5">
            {todaysPendingTasks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 px-1 flex items-center gap-2">
                  {dict.dashboard.pending} ({todaysPendingTasks.length})
                </h2>
                <div className="space-y-2">
                  {todaysPendingTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task as any}
                      style={{ animationDelay: `${index * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="opacity-60 hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 px-1">
                  {dict.dashboard.completedTasks} ({completedTasks.length})
                </h2>
                <div className="space-y-2">
                  {completedTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task as any}
                      style={{ animationDelay: `${(todaysPendingTasks.length + index) * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Fixed Quick Input at bottom, agora com o userId para gravação local */}
      {userId && <QuickInput userId={userId} />}
    </>
  );
}
