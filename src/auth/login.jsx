import { useState } from "react";
import boslogo from "@/assets/light_logo.png";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const Spinner = () => (
        <svg
            className="ml-2 h-5 w-5 animate-spin text-blue-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            // Save to context
            login(data.user);

            // Redirecting to the dashboard if SUCCESSFUL
            setTimeout(() => {
                navigate("/verify");
            }, 2000);
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
            <div className="flex w-full max-w-[1000px] flex-col items-center justify-center gap-10 md:flex-row">
                {/* Logo Section */}
                <div className="flex h-[300px] w-full items-center justify-center rounded-2xl bg-blue-100 shadow-lg md:h-[600px] md:w-full">
                    <img
                        src={boslogo}
                        alt="BOS Logo"
                        className="w-60 md:w-[400px]"
                    />
                </div>

                {/* Login Form Section */}
                <div
                    className="flex h-auto w-full flex-col justify-center rounded-2xl p-8 text-white shadow-2xl md:h-[600px] md:w-[50%] md:p-10"
                    style={{ backgroundColor: "#173B7E" }}
                >
                    <h2 className="mb-7 text-center text-3xl font-bold md:text-left">Login</h2>

                    {error && <div className="mb-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-red-600 shadow">{error}</div>}

                    <form
                        className="space-y-4"
                        onSubmit={handleLogin}
                    >
                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                            <div
                                className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="mr-2"
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-md bg-white py-2 font-semibold text-blue-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    Authenticating...
                                    <Spinner />
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                        {/* Forgot Password button */}
                        <div className="mt-2 text-center text-sm text-blue-200">
                            <a
                                href="/forgot-password"
                                className="hover:underline"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
