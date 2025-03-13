"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Task, TaskStatus } from "../interfaces/task";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getAllTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * Provides a React context for managing tasks.
 *
 * This provider component maintains an internal list of tasks and exposes functions to add, update, delete,
 * and retrieve tasks (by status or all) via a React context. It should wrap any components that need to access
 * task management functionality.
 *
 * @param children - The React elements that will have access to the task context.
 */
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);


  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getAllTasks = () => {
    return tasks;
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      getTasksByStatus,
      getAllTasks 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Retrieves the task context.
 *
 * This hook provides access to the current task context, including the task list and
 * functions for adding, updating, deleting, and retrieving tasks. It must be used within
 * a TaskProvider to ensure the context is available.
 *
 * @throws {Error} If used outside of a TaskProvider.
 * @returns The task context.
 */
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}