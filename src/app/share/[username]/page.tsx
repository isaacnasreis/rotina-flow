import { TaskCard } from "@/components/features/TaskCard";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface SharePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function SharedRoutinePage({ params }: SharePageProps) {
  const resolvedParams = await params;

  const user = await prisma.user.findUnique({
    where: { username: resolvedParams.username },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 p-6">
      <main className="max-w-4xl mx-auto mt-12 pb-24">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-mono uppercase tracking-widest mb-6 text-purple-400">
            Modo Visualização
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Fluxo de {user.name}
          </h2>
          <p className="opacity-50 font-mono text-sm uppercase mt-2">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </header>

        <div className="relative border-l-2 border-white/5 pl-8 ml-4 pointer-events-none">
          {user.tasks.length === 0 ? (
            <p className="text-white/30 italic">
              Nenhum fluxo definido para hoje.
            </p>
          ) : (
            user.tasks.map((task) => (
              <div key={task.id} className="pointer-events-auto">
                <TaskCard
                  task={{
                    id: task.id,
                    title: task.title,
                    time: "00:00",
                    description: task.description || "Sem detalhes adicionais.",
                    category: task.category,
                    isCompleted: task.isCompleted,
                  }}
                  isReadOnly={true}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
