import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const namePattern = /^[A-Za-z ]{3,50}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8}$/;

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const nameValid = namePattern.test(name.trim());
    const emailValid = emailPattern.test(email.trim());
    const passwordValid = passwordPattern.test(password);

    const canSubmit = nameValid && emailValid && passwordValid;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) {
            setSubmitError("Please fix the validation errors before continuing.");
            return;
        }
        const result = await register(name.trim(), email.trim().toLowerCase(), password);
        if (!result.success) {
            setSubmitError(result.message ?? "Unable to create account.");
            return;
        }
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-lg sm:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold text-slate-900">Create your account</h1>
                    <p className="mt-2 text-sm text-slate-600">Start managing tasks with a private, local session.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Name</span>
                        <div className="mt-2 flex items-center rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <UserIcon size={18} className="text-slate-400" />
                            <input
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="ml-3 flex-1 bg-transparent text-sm text-slate-900 outline-none"
                                placeholder="Jane Doe"
                            />
                        </div>
                        <p className={`mt-2 text-xs ${nameValid ? "text-emerald-600" : "text-rose-600"}`}>
                            {name ? (nameValid ? "Name looks good." : "Name must contain 3–50 letters and spaces only.") : "Enter your full name."}
                        </p>
                    </label>

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
                        <p className={`mt-2 text-xs ${emailValid ? "text-emerald-600" : "text-rose-600"}`}>
                            {email ? (emailValid ? "Valid email." : "Email must use a standard format.") : "Enter your account email."}
                        </p>
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Password</span>
                        <div className="mt-2 flex items-center rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="ml-3 flex-1 bg-transparent text-sm text-slate-900 outline-none"
                                placeholder="8 characters, 1 uppercase, 1 number"
                                type={showPassword ? "text" : "password"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                className="inline-flex items-center rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className={`mt-2 text-xs ${passwordValid ? "text-emerald-600" : "text-rose-600"}`}>
                            {password
                                ? passwordValid
                                    ? "Password is strong."
                                    : "Password must be exactly 8 chars with upper, lower, number and symbol."
                                : "Choose a secure password."}
                        </p>
                    </label>

                    {submitError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitError}</p> : null}

                    <button
                        type="submit"
                        className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        disabled={!canSubmit}
                    >
                        Create account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
                        Click here to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
