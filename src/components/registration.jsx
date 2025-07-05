import { useEffect, useState } from "react";
import boslogo from "@/assets/light_logo.png";
import { Mail, Lock, Eye, EyeOff, User, Phone, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

const Register = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [user_fname, setFName] = useState("");
    const [user_mname, setMName] = useState("");
    const [user_lname, setLName] = useState("");
    const [user_email, setEmail] = useState("");
    const [user_password, setPassword] = useState("");
    const [user_phonenum, setPhone] = useState("");
    const [user_role, setRole] = useState("Paralegal");
    const [branch_id, setBranchId] = useState("");
    const [branches, setBranches] = useState([]);

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    // 🔐 Redirect if not Admin
    useEffect(() => {
        if (!user || user.user_role !== "Admin") {
            navigate("/unauthorized");
        }
    }, [user, navigate]);

    // 🌐 Fetch branch list from backend
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/branches");
                const data = await res.json();
                setBranches(data);
            } catch (err) {
                console.error("Failed to load branches:", err);
            }
        };

        fetchBranches();
    }, []);

    // 🔄 Form submission
    const handleRegistration = async (e) => {
        e.preventDefault();

        const userData = {
            user_email,
            user_password,
            user_fname,
            user_mname,
            user_lname,
            user_phonenum,
            user_role,
            branch_id,
            created_by: user?.user_id,
        };

        try {
            const res = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("✅ User successfully registered.");

                // Reset form
                setFName("");
                setMName("");
                setLName("");
                setEmail("");
                setPassword("");
                setPhone("");
                setRole("Paralegal");
                setBranchId("");
            } else {
                setMessage(data.error || "❌ Registration failed.");
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ An unexpected error occurred.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
            <div className="w-full max-w-4xl rounded-2xl bg-[#173B7E] p-10 text-white shadow-2xl">
                {/* Logo */}
                <div className="mb-4 flex justify-center">
                    <img
                        src={boslogo}
                        alt="BOS Logo"
                        className="w-40 md:w-52"
                    />
                </div>

                <h2 className="mb-6 text-center text-3xl font-bold">Register a New User</h2>

                {/* Feedback Message */}
                {message && <div className="mb-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-900 shadow">{message}</div>}

                <form
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    onSubmit={handleRegistration}
                >
                    {/* First Name */}
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                        <input
                            type="text"
                            value={user_fname}
                            onChange={(e) => setFName(e.target.value)}
                            placeholder="First Name"
                            className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Middle Name */}
                    <input
                        type="text"
                        value={user_mname}
                        onChange={(e) => setMName(e.target.value)}
                        placeholder="Middle Name (optional)"
                        className="w-full rounded-md border border-blue-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* Last Name */}
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                        <input
                            type="text"
                            value={user_lname}
                            onChange={(e) => setLName(e.target.value)}
                            placeholder="Last Name"
                            className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                        <input
                            type="email"
                            value={user_email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={user_password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <div
                            className="absolute right-3 top-2.5 cursor-pointer text-gray-300 hover:text-gray-100"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                        <input
                            type="text"
                            value={user_phonenum}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone Number"
                            className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Role */}
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                        <select
                            value={user_role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-md border border-blue-300 px-4 py-2 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="Paralegal">Paralegal</option>
                            <option value="Lawyer">Lawyer</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Branch Dropdown (from API) */}
                    <div className="relative">
                        <select
                            value={branch_id}
                            onChange={(e) => setBranchId(e.target.value)}
                            className="w-full rounded-md border border-blue-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                                <option
                                    key={branch.branch_id}
                                    value={branch.branch_id}
                                >
                                    {branch.branch_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-white py-2 font-semibold text-blue-900 transition hover:bg-gray-100"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
