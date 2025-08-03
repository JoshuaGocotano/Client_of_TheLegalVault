import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export const showToastWithTimer = (message, type = "success", duration = 5000) => {
    toast.custom((t) => (
        <TimerToast
            t={t}
            message={message}
            type={type}
            duration={duration}
        />
    ));
};

function TimerToast({ t, message, type, duration }) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        let start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (elapsed >= duration) {
                toast.dismiss(t.id);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [t.id, duration]);

    const bgColor = type === "error" ? "bg-red-600" : "bg-green-600";

    return (
        <div className={`rounded-md bg-white ${t.visible ? "animate-enter" : "animate-leave"}`}>
            <div className="p-3 text-sm text-black">{message}</div>
            <div className="h-1 w-full bg-gray-200">
                <div
                    className={`${bgColor} h-full transition-all duration-100`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
