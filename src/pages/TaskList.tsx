import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Filter, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import type { TaskPriority, Task } from "../hooks/useTasks";
import { useTasks } from "../hooks/useTasks";

interface ToastItem {
    id: string;
    message: string;
}

const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];
const filterOptions = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "done", label: "Done" },
] as const;

const TaskList = () => {
    const { user } = useAuth();
    const { filteredTasks, loading, error, filter, setFilter, addTask, updateTask, deleteTask, toggleComplete } = useTasks(user?.id ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [formState, setFormState] = useState({ title: "", description: "", priority: "Medium" as TaskPriority, dueDate: "" });
    const [formError, setFormError] = useState("");
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        if (!toasts.length) return;
        const timers = toasts.map((toast) =>
            window.setTimeout(() => {
                setToasts((current) => current.filter((item) => item.id !== toast.id));
            }, 3200),
        );
        return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, [toasts]);

    const showToast = (message: string) => {
        setToasts((current) => [...current, { id: `${Date.now()}-${Math.random()}`, message }]);
    };

    const openModal = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setFormState({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate });
        } else {
            setEditingTask(null);
            setFormState({ title: "", description: "", priority: "Medium", dueDate: "" });
        }
        setFormError("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        setFormError("");
    };

    const validTitle = formState.title.trim().length >= 3;
    const validDescription = formState.description.trim().length >= 10;
    const validDueDate = Boolean(formState.dueDate);

    const canSave = validTitle && validDescription && validDueDate;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSave) {
            setFormError("Please complete all fields with valid data.");
            return;
        }
        const payload = {
            title: formState.title.trim(),
            description: formState.description.trim(),
            priority: formState.priority,
            dueDate: formState.dueDate,
        };
        if (editingTask) {
            updateTask({ ...editingTask, ...payload });
            showToast("Task updated successfully.");
        } else {
            addTask(payload);
            showToast("Task created successfully.");
        }
        closeModal();
    };

    const handleDelete = (taskId: string) => {
        deleteTask(taskId);
        showToast("Task removed.");
    };

    const handleToggle = (taskId: string) => {
        toggleComplete(taskId);
        showToast("Task status updated.");
    };

    const taskCountLabel = useMemo(() => {
        if (filter === "active") return `Active tasks (${filteredTasks.length})`;
        if (filter === "done") return `Done tasks (${filteredTasks.length})`;
        return `All tasks (${filteredTasks.length})`;
    }, [filter, filteredTasks.length]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 rounded-4xl bg-white px-6 py-6 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Task list</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage your tasks</h1>
                    <p className="mt-2 text-sm text-slate-600">Create, update, and filter your own task list.</p>
                </div>

                <button
                    type="button"
                    onClick={() => openModal()}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    <Plus size={18} />
                    New task
                </button>
            </div>

            <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => setFilter(option.id)}
                            className={`rounded-3xl px-4 py-2 text-sm font-medium transition ${filter === option.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <Filter size={16} />
                    {taskCountLabel}
                </div>
            </div>

            <div className="space-y-5">
                {loading ? (
                    [1, 2, 3].map((index) => (
                        <div key={index} className="h-36 animate-pulse rounded-3xl bg-slate-200" />
                    ))
                ) : error ? (
                    <div className="rounded-3xl bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 shadow-sm">
                        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                            <ClipboardList size={28} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">No tasks yet</h2>
                        <p className="mt-2 text-sm text-slate-500">Start by creating a new task to keep your day organized.</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggle}
                            onEdit={openModal}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {isModalOpen ? (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/60 px-4 py-8">
                    <div className="w-full max-w-2xl rounded-4xl bg-white p-8 shadow-2xl sm:p-10" onClick={(event) => event.stopPropagation()}>
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{editingTask ? "Edit task" : "New task"}</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{editingTask ? "Update your task details" : "Create a quick task"}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-full bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200"
                            >
                                Close
                            </button>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Title</span>
                                <input
                                    value={formState.title}
                                    onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                    placeholder="Design homepage card"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Description</span>
                                <textarea
                                    value={formState.description}
                                    onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                                    className="mt-2 min-h-30 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                    placeholder="Describe the task in a few sentences"
                                />
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Priority</span>
                                    <select
                                        value={formState.priority}
                                        onChange={(event) => setFormState((current) => ({ ...current, priority: event.target.value as TaskPriority }))}
                                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                    >
                                        {priorityOptions.map((priority) => (
                                            <option key={priority} value={priority}>
                                                {priority}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Due date</span>
                                    <input
                                        value={formState.dueDate}
                                        onChange={(event) => setFormState((current) => ({ ...current, dueDate: event.target.value }))}
                                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                        type="date"
                                    />
                                </label>
                            </div>

                            {formError ? <p className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</p> : null}

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                                    disabled={!canSave}
                                >
                                    {editingTask ? "Save changes" : "Create task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            <div className="pointer-events-none fixed bottom-6 right-6 z-40 flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto rounded-3xl bg-slate-900 px-5 py-3 text-sm text-white shadow-xl">
                        {toast.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
