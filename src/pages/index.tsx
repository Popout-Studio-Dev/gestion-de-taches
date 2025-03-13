"use client";

import { useTasks } from "@/context/TaskContext";
import { useRouter } from "next/navigation";
import { TaskStatus, Task } from "../interfaces/task"; 
import TaskList from "../pages/list_task";

export default function Home() {
  const { tasks, deleteTask } = useTasks();
  const router = useRouter();


  // Fonction pour calculer les statistiques de tâches
  const calculateTaskStats = () => {
    const waitingTasks = tasks.filter(task => task.status === TaskStatus.WAITING).length;
    const ongoingTasks = tasks.filter(task => task.status === TaskStatus.ONGOING).length;
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const totalTasks = tasks.length;
    
    return {
      waiting: waitingTasks,
      ongoing: ongoingTasks,
      completed: completedTasks,
      total: totalTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };
  
  const taskStats = calculateTaskStats();
  
  const handleTaskClick = (task: Task) => {
    router.push(`/edit-task/${task.id}`);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      deleteTask(id);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="page-header mb-4">Gestionnaire de Tâches</h1>
      
      {/* Stats Dashboard */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="task-stats bg-primary text-white">
            <div className="h5 mb-0 font-weight-bold">{taskStats.total}</div>
            <div className="text-uppercase">Tâches au total</div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="task-stats bg-warning text-white">
            <div className="h5 mb-0 font-weight-bold">{taskStats.waiting}</div>
            <div className="text-uppercase">En attente</div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="task-stats bg-info text-white">
            <div className="h5 mb-0 font-weight-bold">{taskStats.ongoing}</div>
            <div className="text-uppercase">En cours</div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="task-stats bg-success text-white">
            <div className="h5 mb-0 font-weight-bold">{taskStats.completionRate}%</div>
            <div className="text-uppercase">Taux de completion</div>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-0">
          <TaskList 
            tasks={tasks} 
            onTaskClick={handleTaskClick} 
            showAddButton={true} 
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}