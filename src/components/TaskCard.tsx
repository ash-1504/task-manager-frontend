import React from "react";
import { CheckCircle2, Edit3, Trash2 } from "lucide-react";
import type { Task } from "../hooks/useTasks";

interface TaskCardProps {
    task: Task;
    onToggleComplete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const priorityStyles: Record<Task["priority"], string> = {
    Low: "bg-emerald-100 text-emerald-800",
    Medium: "bg-amber-100 text-amber-800",
    High: "bg-rose-100 text-rose-800",
};

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
    const dueDate = new Date(task.dueDate);
    const dueLabel = Number.isNaN(dueDate.getTime())
        ? "No due date"
        : dueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>{task.priority}</span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Due: {dueLabel}</p>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onToggleComplete(task.id)}
                        className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition ${task.completed ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        <CheckCircle2 size={16} />
                        {task.completed ? "Mark Active" : "Mark Done"}
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-rose-100 px-3 py-2 text-sm font-medium text-rose-800 transition hover:bg-rose-200"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
};

export default React.memo(TaskCard);
