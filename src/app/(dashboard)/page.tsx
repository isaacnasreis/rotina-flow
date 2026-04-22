import { TaskCard } from "@/components/features/TaskCard";

const MOCK_TASKS = [
  {
    id: "1",
    time: "08:00 - 09:30",
    title: "Deep Work: UI Design",
    description:
      "Focar na tipografia do projeto e nos contrastes do dark mode.",
    category: "trabalho",
  },
  {
    id: "2",
    time: "10:00 - 11:00",
    title: "Treino de Corrida",
    description: "Corrida leve de 5km para manter o ritmo.",
    category: "saude",
  },
  {
    id: "3",
    time: "14:00 - 16:00",
    title: "Estudos: UX Engineering",
    description: "Revisar conceitos de animações fluidas e micro-interações.",
    category: "estudo",
  },
];

export default function DashboardPage() {
  return (
    <section className="mt-12">
      <header className="mb-12">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">
          Rotina Diária
        </h2>
        <p className="opacity-50 font-mono text-sm uppercase">
          Quarta-feira, 22 de Abril
        </p>
      </header>

      <div className="relative border-l-2 border-white/5 pl-8 ml-4">
        {MOCK_TASKS.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
