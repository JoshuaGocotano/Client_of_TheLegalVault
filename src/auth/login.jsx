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

    const handleLogin = (e) => {
        e.preventDefault();

        // 👉 TODO: Replace with real backend API check
        if (email === "admin@example.com" && password === "password123") {
            // Save user (mock) to context
            login({ email }); // You can also add roles, permissions, etc.

            // Redirect to 2FA screen
            navigate("/verify");
        } else {
            alert("Invalid email or password");
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

                    <form
                        className="space-y-4"
                        onSubmit={handleLogin}
                    >
                        {/* Email Input */}
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

                        {/* Password Input */}
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
                            className="w-full rounded-md bg-white py-2 font-semibold text-blue-900 transition hover:bg-gray-100"
                        >
                            Login
                        </button>

                        {/* Forgot Password Link */}
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
