import React from "react";
import { LockIcon } from "lucide-react";

export const UnauthorizedAccess = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 text-center shadow-2xl">
                <div className="flex justify-center">
                    <LockIcon className="h-12 w-12 text-red-500" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">Unauthorized Access</h1>
                <p className="text-gray-600">You don’t have permission to view this page. Please contact your administrator or go back.</p>
                <a
                    href="/"
                    className="inline-block rounded-xl bg-red-500 px-6 py-2 text-white shadow transition hover:bg-red-600"
                >
                    Go Back
                </a>
            </div>
        </div>
    );
};
