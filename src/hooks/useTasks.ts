import { useEffect, useMemo, useState } from "react";

export type TaskPriority = "Low" | "Medium" | "High";
export type TaskFilter = "all" | "active" | "done";

export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
    completed: boolean;
}

const STORAGE_TASKS_KEY = "tasks";

const readAllTasks = (): Task[] => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(STORAGE_TASKS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored) as Task[];
    } catch {
        return [];
    }
};

const writeAllTasks = (tasks: Task[]) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
};

const generateId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const useTasks = (userId: string) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<TaskFilter>("all");

    useEffect(() => {
        let active = true;
        const timer = window.setTimeout(() => {
            try {
                const allTasks = readAllTasks();
                if (!active) return;
                setTasks(allTasks.filter((task) => task.userId === userId));
                setError(null);
            } catch {
                if (!active) return;
                setError("Could not load tasks.");
            } finally {
                if (!active) return;
                setLoading(false);
            }
        }, 700);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [userId]);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (filter === "active") return !task.completed;
            if (filter === "done") return task.completed;
            return true;
        });
    }, [filter, tasks]);

    const persistTasks = (nextTasks: Task[]) => {
        const allTasks = readAllTasks();
        const mergedTasks = [...allTasks.filter((task) => task.userId !== userId), ...nextTasks];
        writeAllTasks(mergedTasks);
    };

    const addTask = (task: Omit<Task, "id" | "userId" | "completed">) => {
        try {
            const newTask: Task = {
                ...task,
                id: generateId(),
                userId,
                completed: false,
            };
            const nextTasks = [...tasks, newTask];
            setTasks(nextTasks);
            persistTasks(nextTasks);
            setError(null);
            return newTask;
        } catch {
            setError("Unable to save the new task.");
            return null;
        }
    };

    const updateTask = (updatedTask: Task) => {
        try {
            const nextTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
            setTasks(nextTasks);
            persistTasks(nextTasks);
            setError(null);
            return updatedTask;
        } catch {
            setError("Unable to update the task.");
            return null;
        }
    };

    const deleteTask = (taskId: string) => {
        try {
            const nextTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(nextTasks);
            persistTasks(nextTasks);
            setError(null);
        } catch {
            setError("Unable to delete the task.");
        }
    };

    const toggleComplete = (taskId: string) => {
        const task = tasks.find((item) => item.id === taskId);
        if (!task) return null;
        return updateTask({ ...task, completed: !task.completed });
    };

    return {
        tasks,
        filteredTasks,
        loading,
        error,
        filter,
        setFilter,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
    };
};
