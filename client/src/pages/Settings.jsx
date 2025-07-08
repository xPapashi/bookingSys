import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Settings() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#ffedee] p-6 flex flex-col">
      <h1 className="text-2xl font-semibold text-[#000200] mb-6">Settings</h1>

      {/* Inne ustawienia tu (np. zmiana hasła) */}

      <button
        onClick={handleLogout}
        className="mt-auto bg-[#e79992] text-white font-medium py-3 px-6 rounded-xl hover:brightness-95 transition"
      >
        Logout
      </button>
    </div>
  );
}
