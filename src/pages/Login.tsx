import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await login(email.trim().toLowerCase(), password);
        if (!result.success) {
            setFormError(result.message ?? "Invalid login attempt.");
            return;
        }
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-lg sm:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-600">Log in to access your personal task workspace.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Email</span>
                        <div className="mt-2 flex items-center rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <Mail size={18} className="text-slate-400" />
                            <input
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="ml-3 flex-1 bg-transparent text-sm text-slate-900 outline-none"
                                placeholder="hello@example.com"
                                type="email"
                            />
                        </div>
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Password</span>
                        <div className="mt-2 flex items-center rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="ml-3 flex-1 bg-transparent text-sm text-slate-900 outline-none"
                                placeholder="Your secure password"
                                type={showPassword ? "text" : "password"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((state) => !state)}
                                className="inline-flex items-center rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </label>

                    {formError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</p> : null}

                    <button type="submit" className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                        Sign in
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="font-semibold text-slate-900 hover:text-slate-700">
                        Click to signup
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
