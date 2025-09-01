import React, { useRef } from 'react';

const AddNewCase = ({ isModalOpen, setIsModalOpen, handleAddCase, newCase, setNewCase }) => {
    const addCaseModalRef = useRef(null);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={addCaseModalRef}
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800"
            >
                <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Case</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                        ["Cabinet Number", "id"],
                        ["Case Name", "name"],
                        ["Category", "category"],
                        ["Client", "client"],
                        ["Branch", "branch"],
                        ["Filed Date", "filedDate", "date"],
                        ["Fee", "fee"],
                    ].map(([label, name, type = "text"]) => (
                        <div key={name}>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={newCase[name]}
                                onChange={(e) => setNewCase({ ...newCase, [name]: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                    ))}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={newCase.description}
                            onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                            className="w-full resize-none rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            rows={4}
                        ></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddCase}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Add Case
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewCase;