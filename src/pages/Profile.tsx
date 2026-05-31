import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
                <div className="mb-8 space-y-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Profile</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Account details</h1>
                    <p className="text-sm text-slate-600">Your active user details are stored locally in the browser.</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <p className="text-sm font-medium text-slate-500">Name</p>
                        <p className="mt-3 text-lg font-semibold text-slate-900">{user.name}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <p className="text-sm font-medium text-slate-500">Email</p>
                        <p className="mt-3 text-lg font-semibold text-slate-900">{user.email}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        type="button"
                        onClick={logout}
                        className="rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
