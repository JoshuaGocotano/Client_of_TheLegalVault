import { useState, useRef } from "react";
import { User, Image } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const AddUser = ({ onClose }) => {
    const [profileImage, setProfileImage] = useState(null);
    const modalRef = useRef(null);

    useClickOutside([modalRef], () => {
        onClose();
        setProfileImage(null);
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800"
            >
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Add New User</h2>
                <form className="space-y-6">
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-2">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Preview"
                                    className="h-24 w-24 rounded-full border border-gray-300 object-cover dark:border-slate-700"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-gray-100 text-sm text-gray-400 dark:border-slate-600 dark:bg-slate-700">
                                    <User className="h-10 w-10" />
                                </div>
                            )}

                            <label className="flex cursor-pointer items-center gap-2 text-sm text-blue-600 hover:underline">
                                <Image className="h-4 w-4" />
                                <span>Upload Profile Picture</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfileImage(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>

                            {profileImage && <p className="text-xs text-gray-500 dark:text-gray-400">File uploaded</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Middle Name"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <select className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white">
                            <option>Role</option>
                            <option>Admin</option>
                            <option>Lawyer</option>
                            <option>Paralegal</option>
                        </select>
                        <select className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white">
                            <option>Select Branch</option>
                            <option>Dumanjug</option>
                            <option>Fuente</option>
                            <option>Camotes</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>

                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 text-2xl text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default AddUser;
