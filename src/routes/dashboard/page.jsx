import { BookCheck, Tickets, TrendingDown, TrendingUp, Users } from "lucide-react";

const DashboardPage = () => {
    return (
        <>
            <div className="flex flex-col gap-y-4">
                <h1 className="title">Dashboard</h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Total Tickets Resolved */}
                    <div className="card">
                        <div className="card-header">
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Tickets size={26} />
                            </div>
                            <p className="card-title">Total Tickets</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">1,202</p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                20%
                            </span>
                        </div>
                    </div>

                    {/* Total Corrective Maintenance Forms */}
                    <div className="card">
                        <div className="card-header">
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <BookCheck size={26} />
                            </div>
                            <p className="card-title">Total CMFs</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">1,004</p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                5%
                            </span>
                        </div>
                    </div>

                    {/* Pending Tickets */}
                    <div className="card">
                        <div className="card-header">
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <BookCheck size={26} />
                            </div>
                            <p className="card-title">Pending Tickets</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">5</p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                5%
                            </span>
                        </div>
                    </div>

                    {/* Total Clients */}
                    <div className="card">
                        <div className="card-header">
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Users size={26} />
                            </div>
                            <p className="card-title">Total Clients</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">91</p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                2%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
