import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_USERS_KEY = "users";
const STORAGE_CURRENT_USER_KEY = "currentUser";

const readUsers = (): User[] => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(STORAGE_USERS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored) as User[];
    } catch {
        return [];
    }
};

const writeUsers = (users: User[]) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

const readCurrentUser = (): User | null => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as User;
    } catch {
        return null;
    }
};

const writeCurrentUser = (user: User | null) => {
    if (typeof window === "undefined") return;
    if (user) {
        window.localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        window.localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
};

const generateId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const current = readCurrentUser();
        if (current) {
            const users = readUsers();
            const matched = users.find((storedUser) => storedUser.email === current.email);
            setUser(matched ?? null);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const users = readUsers();
        const matched = users.find((existing) => existing.email === email && existing.password === password);
        if (!matched) {
            return { success: false, message: "Email or password is incorrect." };
        }
        setUser(matched);
        writeCurrentUser(matched);
        return { success: true };
    };

    const register = async (name: string, email: string, password: string) => {
        const users = readUsers();
        const existing = users.some((stored) => stored.email === email);
        if (existing) {
            return { success: false, message: "A user with that email already exists." };
        }
        const newUser: User = {
            id: generateId(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        };
        const nextUsers = [...users, newUser];
        writeUsers(nextUsers);
        setUser(newUser);
        writeCurrentUser(newUser);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        writeCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};
