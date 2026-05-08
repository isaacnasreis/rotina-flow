import { DashboardBlocks } from "@/components/features/DashboardBlocks";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      }
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const blocks = await prisma.block.findMany({
    where: { userId },
    orderBy: { order: "asc" },
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

      <DashboardBlocks 
        blocks={blocks}
        tasks={tasks.map(task => ({
          id: task.id,
          title: task.title,
          time: `${formatTime(task.startTime)} - ${formatTime(task.endTime)}`,
          startTimeStr: formatTime(task.startTime),
          endTimeStr: formatTime(task.endTime),
          description: task.description || "",
          category: task.category,
          isCompleted: task.isCompleted,
          blockId: task.blockId,
        }))} 
      />
    </section>
  );
}
