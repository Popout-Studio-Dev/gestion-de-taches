"use client";

import { useTasks } from "@/context/TaskContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { tasks, deleteTask } = useTasks();
  const router = useRouter();

  return (
    <div className="container mt-5">
      <h1>Liste des Tâches</h1>
      <Link href="/add-task" className="btn btn-primary mb-3">+ Ajouter une tâche</Link>

      {tasks.length === 0 ? (
        <p>Aucune tâche pour le moment.</p>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span 
                className={`task-title ${task.completed ? "text-decoration-line-through" : ""}`} 
                onClick={() => router.push(`/edit-task/${task.id}`)}
                style={{ cursor: "pointer" }}
              >
                {task.title} - {task.status}
              </span>
              <div>
                <button onClick={() => router.push(`/edit-task/${task.id}`)} className="btn btn-warning me-2">✏️</button>
                <button onClick={() => deleteTask(task.id)} className="btn btn-danger">❌</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
