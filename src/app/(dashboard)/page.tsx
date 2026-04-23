import { NewTaskForm } from "@/components/features/NewTaskForm";
import { TaskCard } from "@/components/features/TaskCard";
import { TaskListWrapper } from "@/components/ui/TaskListWrapper";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="mt-12">
      <header className="mb-12">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">
          Rotina Diária
        </h2>
        <p className="opacity-50 font-mono text-sm uppercase">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      <NewTaskForm />

      <div className="relative border-l-2 border-white/5 pl-8 ml-4">
        <TaskListWrapper>
          {tasks.length === 0 ? (
            <p className="text-white/30 italic">
              A rotina de hoje está limpa. Adicione um fluxo acima.
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={{
                  id: task.id,
                  title: task.title,
                  time: `${formatTime(task.startTime)} - ${formatTime(task.endTime)}`,
                  description: task.description || "Sem detalhes adicionais.",
                  category: task.category,
                  isCompleted: task.isCompleted,
                }}
              />
            ))
          )}
        </TaskListWrapper>
      </div>
    </section>
  );
}
