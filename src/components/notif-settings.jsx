import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotificationSettings = () => {
    const navigate = useNavigate();

    const [pushSettings, setPushSettings] = useState({
        activity: true,
        updates: false,
        reminders: false,
    });

    const [systemSettings, setSystemSettings] = useState({
        report: true,
        productUpdates: true,
        account: false,
    });

    const [emailFreq, setEmailFreq] = useState("Real-time");

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                </button>
            </div>

            <div className="space-y-6 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 sm:p-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">Notification Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage how you receive notifications and updates.</p>
                </div>

                {/* Push Notifications */}
                <div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Push Notifications</h2>
                    <Toggle
                        label="New Activity"
                        checked={pushSettings.activity}
                        onChange={() =>
                            setPushSettings((prev) => ({
                                ...prev,
                                activity: !prev.activity,
                            }))
                        }
                    />
                    <Toggle
                        label="Updates"
                        checked={pushSettings.updates}
                        onChange={() =>
                            setPushSettings((prev) => ({
                                ...prev,
                                updates: !prev.updates,
                            }))
                        }
                    />
                    <Toggle
                        label="Reminders"
                        checked={pushSettings.reminders}
                        onChange={() =>
                            setPushSettings((prev) => ({
                                ...prev,
                                reminders: !prev.reminders,
                            }))
                        }
                    />
                </div>

                {/* System Notifications */}
                <div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">System Notifications</h2>
                    <Toggle
                        label="Report"
                        checked={systemSettings.report}
                        onChange={() =>
                            setSystemSettings((prev) => ({
                                ...prev,
                                report: !prev.report,
                            }))
                        }
                    />
                    {/* Add more toggles if needed */}
                </div>

                {/* Email Frequency */}
                <div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Email Frequency</h2>
                    <div className="space-y-2">
                        {["Real-time", "Daily digest", "Weekly digest"].map((opt) => (
                            <label
                                key={opt}
                                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                            >
                                <input
                                    type="radio"
                                    value={opt}
                                    checked={emailFreq === opt}
                                    onChange={(e) => setEmailFreq(e.target.value)}
                                    className="accent-blue-600"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => alert("Save Changes...")}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-2 text-sm text-gray-800 dark:text-gray-200">
        <span>{label}</span>
        <label className="relative inline-block h-5 w-10">
            <input
                type="checkbox"
                className="peer h-0 w-0 opacity-0"
                checked={checked}
                onChange={onChange}
            />
            <span className="absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-full bg-gray-300 before:absolute before:left-1 before:top-1 before:h-3 before:w-3 before:rounded-full before:bg-white before:transition-transform peer-checked:bg-blue-500 peer-checked:before:translate-x-5"></span>
        </label>
    </div>
);

export default NotificationSettings;
