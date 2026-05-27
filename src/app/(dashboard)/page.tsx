import { QuickInput } from "@/components/features/QuickInput";
import { TaskItem } from "@/components/features/TaskItem";
import { ProgressRing } from "@/components/features/ProgressRing";
import { EmptyState } from "@/components/features/EmptyState";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardActions } from "@/components/features/DashboardActions";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      OR: [
        { createdAt: { gte: startOfDay, lte: endOfDay } },
        { isCompleted: false, createdAt: { lt: startOfDay } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatTime = (date: Date | null) => {
    if (!date) return undefined;
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mappedTasks = tasks.map((task) => ({
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

  // Custom sorting logic
  mappedTasks.sort((a, b) => {
    // 1. Priority to Scheduled (Time)
    if (a.startTime && !b.startTime) return -1;
    if (!a.startTime && b.startTime) return 1;
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    
    // 2. Priority to Rollovers (Yesterday's tasks)
    const isARolledOver = new Date(a.createdAt) < startOfDay;
    const isBRolledOver = new Date(b.createdAt) < startOfDay;
    if (isARolledOver && !isBRolledOver) return -1;
    if (!isARolledOver && isBRolledOver) return 1;
    
    // 3. Fallback to newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const completedCount = mappedTasks.filter((t) => t.isCompleted).length;
  const totalCount = mappedTasks.length;

  // Separate completed from pending for better UX
  const pendingTasks = mappedTasks.filter((t) => !t.isCompleted);
  const completedTasks = mappedTasks.filter((t) => t.isCompleted);

  return (
    <>
      <DynamicBackground />

      <section className="pt-8">
        {/* Header with date and progress */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white/90">
              Rotina do dia
            </h2>
            <p className="text-sm text-white/30 mt-1 capitalize">
              {now.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {totalCount > 0 && (
              <DashboardActions />
            )}
            <ProgressRing completed={completedCount} total={totalCount} size={72} />
          </div>
        </header>

        {/* Task List */}
        {totalCount === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-1.5">
            {/* Pending tasks first */}
            {pendingTasks.map((task, i) => (
              <TaskItem
                key={task.id}
                task={task}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}

            {/* Completed section */}
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
                style={{ animationDelay: `${(pendingTasks.length + i) * 50}ms` }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Fixed Quick Input at bottom */}
      <QuickInput />
    </>
  );
}
