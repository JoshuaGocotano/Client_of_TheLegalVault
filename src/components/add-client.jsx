import { useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const AddClient = ({ AddClients, setAddClients }) => {
    const modalRef = useRef(null);

    useClickOutside([modalRef], () => setAddClients(null));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Client added");
        setAddClients(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800"
            >
                <button
                    onClick={() => setAddClients(null)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Client</h2>

                <form
                    className="space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Contact Person Name"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="tel"
                            placeholder="Contact Person Number"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="tel"
                            placeholder="Relation/Role"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
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
            </div>
        </div>
    );
};

export default AddClient;
