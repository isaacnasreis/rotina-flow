import { TaskItem } from "@/components/features/TaskItem";
import { EmptyState } from "@/components/features/EmptyState";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface SharePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function SharedRoutinePage({ params }: SharePageProps) {
  const resolvedParams = await params;

  const sharedAccess = await prisma.sharedAccess.findUnique({
    where: { accessToken: resolvedParams.token },
    include: {
      owner: {
        include: {
          tasks: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!sharedAccess) {
    notFound();
  }

  const user = sharedAccess.owner;

  const formatTime = (date: Date | null) => {
    if (!date) return undefined;
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mappedTasks = user.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    startTime: formatTime(task.startTime),
    endTime: formatTime(task.endTime),
    isCompleted: task.isCompleted,
    category: task.category,
    blockId: task.blockId || undefined,
    createdAt: task.createdAt,
  }));

  const pendingTasks = mappedTasks.filter((t) => !t.isCompleted);
  const completedTasks = mappedTasks.filter((t) => t.isCompleted);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 selection:bg-purple-500">
      <DynamicBackground />
      
      <div className="relative z-10">
        <main className="max-w-2xl mx-auto px-5 pt-12 pb-24">
          <header className="mb-10 text-center">
            <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 text-purple-400 border border-purple-500/20">
              Modo Visualização
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white/90">
              Rotina de {user.name}
            </h2>
            <p className="text-sm text-white/30 mt-2 capitalize">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </header>

          <section>
            {mappedTasks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-1.5">
                {pendingTasks.map((task, i) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isReadOnly={true}
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}

                {completedTasks.length > 0 && pendingTasks.length > 0 && (
                  <div className="flex items-center gap-3 py-4 px-1">
                    <div className="h-px flex-1 bg-white/[0.04]" />
                    <span className="text-[10px] uppercase tracking-widest text-white/15 font-bold">
                      Concluídas
                    </span>
                    <div className="h-px flex-1 bg-white/[0.04]" />
                  </div>
                )}

                {completedTasks.map((task, i) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isReadOnly={true}
                    style={{ animationDelay: `${(pendingTasks.length + i) * 50}ms` }}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
