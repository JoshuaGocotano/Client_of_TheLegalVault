import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Check session
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/verify", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok && data.user) {
                    login(data.user);
                } else {
                    logout();
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await fetch("http://localhost:3000/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }

        setUser(null);
        localStorage.removeItem("user");
    };

    return <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
