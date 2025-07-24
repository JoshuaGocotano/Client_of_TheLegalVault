import { useState } from "react";
import boslogo from "@/assets/light_logo.png";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Call backend to initiate password reset
        alert(`Password reset link sent to ${email}`);
        navigate("/verify");
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

                {/* Forgot Password Form Section */}
                <div
                    className="flex h-auto w-full flex-col justify-center rounded-2xl p-8 text-white shadow-2xl md:h-[600px] md:w-[50%] md:p-10"
                    style={{ backgroundColor: "#173B7E" }}
                >
                    <h2 className="mb-2 text-center text-3xl font-bold md:text-left">Forgot Password</h2>
                    <p className="mb-6 text-center text-sm text-blue-200 md:text-left">Enter your email address to receive a password reset link.</p>

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >
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

                        <button
                            type="submit"
                            className="w-full rounded-md bg-white py-2 font-semibold text-blue-900 transition hover:bg-gray-100"
                        >
                            Send Reset Link
                        </button>

                        <div className="mt-2 text-center text-sm text-blue-200">
                            <a
                                href="/login"
                                className="hover:underline"
                            >
                                Back to login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
