"use client";

import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { useRouter } from "next/navigation";
import { TaskStatus, Task } from "../interfaces/task"; 
import TaskList from "../pages/list_task";
import Modal from "react-modal";
import Image from "next/image";

// Configuration de la modale pour être accessible
Modal.setAppElement("#__next");

export default function Home() {
  const { tasks, deleteTask } = useTasks();
  const router = useRouter();
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Fonction pour afficher la modale de confirmation
  const openDeleteModal = (id: string) => {
    setTaskToDelete(id);
    setModalIsOpen(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setModalIsOpen(false);
  };

  // Fonction pour annuler la suppression
  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setModalIsOpen(false);
  };

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

  const profiles = [
    {
      name: "Joseph Ewondjo",
      role: "Développeur",
      image: "/images/profile1.jpeg",
      linkedin: "https://www.linkedin.com/in/joseph-ewondjo",
    },
    {
      name: "Brayan Armel Kuate Kamga",
      role: "Développeur",
      image: "/images/profile2.jpeg",
      linkedin: "https://www.linkedin.com/in/brayan-armel-kuate-kamga-244a24184/",
    },
    {
      name: "Talom Arthur Arold",
      role: "Développeur",
      image: "",
      linkedin: 'https://www.linkedin.com/in/arthur-talom-569020251/',
    }
  ];

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
            onDeleteTask={openDeleteModal}
          />
        </div>
      </div>

      {/* Modale de confirmation */}
      <Modal 
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer cette tâche ?</p>
        <div className="modal-buttons">
          <button onClick={confirmDelete} className="btn btn-danger">Supprimer</button>
          <button onClick={closeDeleteModal} className="btn btn-secondary">Annuler</button>
        </div>
      </Modal>


  {/* Cartes LinkedIn */}
  <div className="mt-5">
    <h2 className="text-center mb-4">Équipe de Développement</h2>
    
    <div className="row g-4"> 
      {profiles.map((profile, index) => (
        <div key={index} className="col-md-4 col-sm-6">
          <div className="card shadow-sm text-center p-3">
            <div className="card-body">
              <Image 
                src={profile.image || "/images/default-profile.png"}  
                alt={profile.name} 
                width={100} 
                height={100} 
                className="rounded-circle mb-3"
                style={{ objectFit: "cover" }}
              />

              <h5 className="card-title fw-bold">{profile.name}</h5>
              <p className="text-muted">{profile.role}</p>

              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                <i className="fab fa-linkedin me-2"></i>Voir le profil
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}
