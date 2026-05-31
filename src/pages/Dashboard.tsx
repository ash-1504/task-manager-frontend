import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";

const Dashboard = () => {
    const { user } = useAuth();
    const { tasks, loading } = useTasks(user?.id ?? "");

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 sm:flex sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Welcome back</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">{user?.name}'s dashboard</h1>
                    <p className="mt-2 text-sm text-slate-600">Your personal task summary is shown below.</p>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                {loading ? (
                    [1, 2, 3].map((item) => (
                        <div key={item} className="h-28 animate-pulse rounded-3xl bg-slate-200" />
                    ))
                ) : (
                    <>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">Total Tasks</p>
                            <p className="mt-4 text-4xl font-semibold text-slate-900">{totalTasks}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">Done Tasks</p>
                            <p className="mt-4 text-4xl font-semibold text-emerald-600">{completedTasks}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">Pending Tasks</p>
                            <p className="mt-4 text-4xl font-semibold text-amber-600">{pendingTasks}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
