import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffedee] flex flex-col px-6 pt-8">
      {/* Strzałka i nagłówek */}
      <div className="flex items-left flex-col mb-15">
        <button
          onClick={() => navigate(-1)}
          className="text-[#e79992] mr-4 mb-15"
        >
          <ArrowLeft size={36} strokeWidth={2} />
        </button>
        <h1 className="text-3xl font-semibold text-[#000200]">Sign In</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-sm mx-auto"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 px-4 py-6 rounded-2xl border border-gray-300 bg-white text-[#383838] focus:outline-none text-xl"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 px-4 py-6 rounded-2xl border border-gray-300 bg-white text-[#383838]  focus:outline-none text-xl"
          required
        />

        <button
          type="submit"
          className="bg-[#e79992] text-white font-normal text-2xl py-6 rounded-3xl hover:brightness-95 transition mb-6"
        >
          Sign In
        </button>

        <p className="flex flex-col text-lg text-[#cd6c60] text-center">
          Don't have an account?{" "}
          <span
            className="font-semibold underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
