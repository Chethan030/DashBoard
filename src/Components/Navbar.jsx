import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../service/api"

export default function Navbar() {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  // Fetch user email on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await axios.get("/api/me/", {
          
        });

        setEmail(res.data.email);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setEmail(null);
        // Optional: force logout if token is invalid
        // handleLogout();
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full h-20 bg-blue-600 text-white flex items-center justify-between px-6 shadow-md py-5">
      <h1 className="text-xl font-bold">Vande Mataram Dashboard</h1>

      <div className="flex items-center gap-4">
        {email && <span className="text-sm">👤 {email}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
