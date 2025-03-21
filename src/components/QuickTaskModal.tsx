"use client"

import React, { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskStatus } from "../interfaces/task";
import Modal from "react-modal";
import Link from "next/link";

interface QuickTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickTaskModal: React.FC<QuickTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    // Création des timestamps
    const now = new Date().toISOString();
    
    // Création d'une nouvelle tâche avec seulement le titre
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: "",
      status: TaskStatus.ONGOING,
      createdAt: now,
      updatedAt: now,
      startedAt: now
    };
    
    addTask(newTask);
    setTitle(""); // Réinitialiser le titre
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content quick-task-modal"
      overlayClassName="modal-overlay"
      contentLabel="Ajouter une tâche rapide"
    >
      <div className="modal-header">
        <h2 className="modal-title">Nouvelle tâche</h2>
      </div>
      
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Titre de la tâche</label>
            <input 
              type="text" 
              className="form-control form-control-lg" 
              id="title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Titre de la tâche" 
              autoFocus
              required 
            />
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
            <Link 
              href="/add-task" 
              className="btn btn-link text-decoration-none mb-3 mb-md-0"
              onClick={onClose}
            >
              <i className="bi bi-card-list me-1"></i>
              Créer avec plus de détails
            </Link>
            
            <div className="d-flex gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={onClose}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!title.trim()}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Ajouter
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default QuickTaskModal;