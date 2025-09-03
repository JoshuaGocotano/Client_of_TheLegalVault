import React, { useRef, useEffect, useState } from "react";

const AddNewCase = ({ isModalOpen, setIsModalOpen, handleAddCase, newCase, setNewCase, addCaseModalRef, user }) => {
    if (!isModalOpen) return null;

    const [clients, setClients] = useState([]);
    const [caseCategories, setCaseCategories] = useState([]);
    const [caseCategoryTypes, setCaseCategoryTypes] = useState([]);
    const [lawyers, setLawyers] = useState([]);

    // Fetching clients here for the dropdown can be implemented later
    useEffect(() => {
        const fetchClientsAndLawyers = async () => {
            try {
                const [clientsRes, lawyersRes] = await Promise.all([
                    fetch("http://localhost:3000/api/clients", {
                        method: "GET",
                        credentials: "include",
                    }),
                    fetch("http://localhost:3000/api/lawyer-specializations", {
                        method: "GET",
                        credentials: "include",
                    }),
                ]);

                if (!clientsRes.ok || !lawyersRes.ok) {
                    throw new Error("Failed to fetch clients and/or lawyers");
                }

                const clientsData = await clientsRes.json();
                const lawyersData = await lawyersRes.json();
                setClients(clientsData);
                setLawyers(lawyersData);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
        fetchClientsAndLawyers();
    }, []);

    // Fetching case categories and types here
    useEffect(() => {
        const fetchCaseCategoriesAndTypes = async () => {
            try {
                const [categoriesRes, typesRes] = await Promise.all([
                    fetch("http://localhost:3000/api/case-categories", {
                        method: "GET",
                        credentials: "include",
                    }),
                    fetch("http://localhost:3000/api/case-category-types", {
                        method: "GET",
                        credentials: "include",
                    }),
                ]);

                if (!categoriesRes.ok || !typesRes.ok) {
                    throw new Error("Failed to fetch case categories or types");
                }
                const categoriesData = await categoriesRes.json();
                const typesData = await typesRes.json();
                setCaseCategories(categoriesData);
                setCaseCategoryTypes(typesData);
            } catch (error) {
                console.error("Error fetching case categories or types:", error);
            }
        };
        fetchCaseCategoriesAndTypes();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={addCaseModalRef}
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800"
            >
                <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-50">Add New Case</h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Client Dropdown */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
                        <select
                            value={newCase.client_id}
                            onChange={(e) => setNewCase({ ...newCase, client_id: e.target.value })}
                            className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                        >
                            <option
                                value=""
                                disabled
                            >
                                Select Client
                            </option>
                            {clients.map((client) => (
                                <option
                                    key={client.client_id}
                                    value={client.client_id}
                                >
                                    {client.client_fullname}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Case CATEGORY ID */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select
                            value={newCase.cc_id}
                            onChange={(e) => {
                                const selectedCcId = e.target.value;
                                setNewCase({ ...newCase, cc_id: selectedCcId, ct_id: "" }); // reset ct_id when category changes
                            }}
                            className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                        >
                            <option
                                value=""
                                disabled
                            >
                                Select Category
                            </option>
                            {caseCategories.map((category) => (
                                <option
                                    key={category.cc_id}
                                    value={category.cc_id}
                                >
                                    {category.cc_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Case TYPE (filtered by cc_id) */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Case Type (Case Name)</label>
                        <select
                            value={newCase.ct_id}
                            onChange={(e) => setNewCase({ ...newCase, ct_id: e.target.value })}
                            className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            disabled={!newCase.cc_id} // disable until a category is selected
                        >
                            <option
                                value=""
                                disabled
                            >
                                {newCase.cc_id ? "Select Case Type" : "Select Category first"}
                            </option>
                            {caseCategoryTypes
                                .filter((type) => type.cc_id === parseInt(newCase.cc_id)) // filter types by category id
                                .map((type) => (
                                    <option
                                        key={type.ct_id}
                                        value={type.ct_id}
                                    >
                                        {type.ct_name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Assign To Lawyers Dropdown */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Assign To</label>
                        <select
                            value={newCase.user_id}
                            onChange={(e) => setNewCase({ ...newCase, user_id: e.target.value })}
                            className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            disabled={user.user_role !== "Admin" || !newCase.ct_id} // disabled if not Admin or no case type
                        >
                            <option
                                value=""
                                disabled
                            >
                                {user.user_role !== "Admin" ? "Only Admin can assign" : !newCase.ct_id ? "Select Case Type first" : "Select Lawyer"}
                            </option>

                            {lawyers
                                .filter((lawyer) => lawyer.ct_id === parseInt(newCase.ct_id)) // only lawyers with this case type
                                .map((lawyer) => (
                                    <option
                                        key={lawyer.user_id}
                                        value={lawyer.user_id}
                                    >
                                        {lawyer.user_fname} 
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Fee */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Fee</label>
                        <input
                            type="number"
                            step="0.01"
                            value={newCase.case_fee}
                            onChange={(e) => setNewCase({ ...newCase, case_fee: e.target.value })}
                            className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Case Status */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Case Status</label>
                        <input
                            value={newCase.case_status}
                            onChange={(e) => setNewCase({ ...newCase, case_status: e.target.value })}
                            className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            readOnly
                        />
                    </div>

                    {/* Remarks */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks / Description </label>
                        <textarea
                            value={newCase.case_remarks}
                            onChange={(e) => setNewCase({ ...newCase, case_remarks: e.target.value })}
                            className="w-full resize-none rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            rows={4}
                        ></textarea>
                    </div>

                    {/* Cabinet */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Cabinet</label>
                        <input
                            type="text"
                            value={newCase.case_cabinet}
                            onChange={(e) => setNewCase({ ...newCase, case_cabinet: e.target.value })}
                            className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    {/* Drawer */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Drawer</label>
                        <input
                            type="text"
                            value={newCase.case_drawer}
                            onChange={(e) => setNewCase({ ...newCase, case_drawer: e.target.value })}
                            className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                        />
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
