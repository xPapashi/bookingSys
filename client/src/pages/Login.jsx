import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthContext"; // Ścieżkę dostosuj do projektu

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user;

      // Zapisujemy do localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(token, user); // aktualizacja kontekstu
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
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
          className="mb-6 px-4 py-6 rounded-2xl border border-gray-300 bg-white text-[#383838] focus:outline-none text-xl"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`text-white font-normal text-2xl py-6 rounded-3xl mb-2 transition ${
            isLoading
              ? "bg-[#e79992] opacity-60 cursor-not-allowed"
              : "bg-[#e79992] hover:brightness-95"
          }`}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <p className="flex flex-col text-lg text-[#cd6c60] text-center mt-6">
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
