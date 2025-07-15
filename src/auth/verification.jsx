// Two-Factor Authentication process here // I just called it verification

import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import boslogo from "@/assets/light_logo.png";
import { ShieldCheck } from "lucide-react";

export default function Verify() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState("");

    const handleVerify = (e) => {
        e.preventDefault();

        // TODO: Replace with actual backend 2FA code validation
        if (code === "123456") {
            navigate("/");
        } else {
            alert("Invalid verification code");
        }
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-blue-50">
                <p className="text-xl text-red-500">Unauthorized</p>
            </div>
        );
    }

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

                {/* 2FA Form Section */}
                <div
                    className="flex h-auto w-full flex-col justify-center rounded-2xl p-8 text-white shadow-2xl md:h-[600px] md:w-[50%] md:p-10"
                    style={{ backgroundColor: "#173B7E" }}
                >
                    <h2 className="mb-2 text-center text-3xl font-bold md:text-left">Two-Factor Authentication</h2>
                    <p className="mb-6 text-center text-sm text-blue-200 md:text-left">
                        Enter the 6-digit code sent to <span className="font-medium">{user.email}</span>
                    </p>

                    <form
                        className="space-y-6"
                        onSubmit={handleVerify}
                    >
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter verification code"
                                className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-white py-2 font-semibold text-blue-900 transition hover:bg-gray-100"
                        >
                            Verify
                        </button>

                        <div className="mt-2 text-center text-sm text-blue-200">
                            Didn’t receive a code?{" "}
                            <a
                                href="#"
                                className="underline"
                            >
                                Resend
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
