import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tasks", label: "Tasks", icon: ListChecks },
    { path: "/profile", label: "Profile", icon: UserCircle },
];

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">TM</span>
                    Task Manager
                </Link>

                <nav className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`
                                    }
                                >
                                    <Icon size={16} />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm sm:px-5">
                        <span className="hidden sm:inline-block">{user?.name}</span>
                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-100"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
