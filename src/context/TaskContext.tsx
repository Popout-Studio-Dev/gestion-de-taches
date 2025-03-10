"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "../interfaces/task";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => setTasks([...tasks, task]);
  const updateTask = (updatedTask: Task) =>
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  const deleteTask = (id: string) =>
    setTasks(tasks.filter((task) => task.id !== id));

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}

export type { Task };