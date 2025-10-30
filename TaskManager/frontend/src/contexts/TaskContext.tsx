import { createContext, useContext, useState, type FC, type ReactNode } from "react";
import type { Task, TaskCreate, TaskUpdate } from "../types";
import { apiService } from "../services/api";

interface TaskContextType {
    tasks: Task[]
    isLoading: boolean
    error: string | null
    fetchTasks: (params?: any) => Promise<void>
    createTask: (taskData: TaskCreate) => Promise<void>
    updateTask: (taskId: number, taskData: TaskUpdate) => Promise<void>
    deleteTask: (taskId: number) => Promise<void>
    clearError: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTask = () => {
    const context = useContext(TaskContext)
    if (context === undefined) {
        throw new Error('useTask must be used within a TaskProvider')
    }
    return context
}

interface TaskProviderProps {
    children: ReactNode
}

export const TaskProvider: FC<TaskProviderProps> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTasks = async (params?: any) => {
        setIsLoading(true)
        setError(null)
        try {
            const tasksData = await apiService.getTasks(params)
            setTasks(tasksData)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to fetch tasks')
        } finally {
            setIsLoading(false)
        }
    }

    const createTask = async (taskData: TaskCreate) => {
        setError(null)
        try {
            const newTask = await apiService.createTask(taskData)
            setTasks(prev => [newTask, ...prev])
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create task')
            throw err;
        }
    }

    const updateTask = async (taskId: number, taskData: TaskUpdate) => {
        setError(null)
        try {
            const updatedTask = await apiService.updateTask(taskId, taskData)
            setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task))
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to update task')
            throw err;
        }
    }

    const deleteTask = async (taskId: number) => {
        setError(null)
        try {
            await apiService.deleteTask(taskId)
            setTasks(prev => prev.filter(task => task.id !== taskId))
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Fai;ed to delete task')
            throw err;
        }
    }

    const clearError = () => setError(null)

    const value: TaskContextType = {
        tasks,
        isLoading, 
        error,
        fetchTasks, 
        createTask,
        updateTask,
        deleteTask,
        clearError
    }

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>

}

