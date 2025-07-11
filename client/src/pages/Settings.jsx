import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { AuthContext } from "../AuthContext";

export default function Settings() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#ffedee] p-6 flex flex-col">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#000200] flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <h1 className="text-2xl font-semibold text-[#000200] mb-6">Settings</h1>

      {user?.role === "admin" && (
        <button
          onClick={() => navigate("/admin")}
          className="bg-white text-[#000200] text-xl py-4 px-4 rounded-xl shadow flex justify-between items-center mb-4"
        >
          Admin Panel <ChevronRight className="text-[#e79992]" />
        </button>
      )}

      <button
        onClick={handleLogout}
        className="mt-auto bg-[#e79992] text-white font-medium py-3 px-6 rounded-xl hover:brightness-95 transition"
      >
        Logout
      </button>
    </div>
  );
}
