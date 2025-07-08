import { useNavigate } from "react-router-dom";
import { Flower2 } from "lucide-react"; // ikonka

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#ffedee] flex flex-col justify-center items-center text-center px-6">
      {/* Logo / Ikona */}
      <div className="mb-6">
        <div className="bg-[#ffffff] p-4 rounded-full shadow-sm">
          <Flower2 className="text-[#e79992] w-10 h-10" />
        </div>
      </div>

      {/* Teksty */}
      <h1 className="text-2xl font text-[#000200] mb-2">
        Take care of yourself –
      </h1>
      <h1 className="text-2xl text-[#000200] mb-40">
        book an appointment online
      </h1>

      {/* Przycisk */}
      <button
        className="bg-[#e79992] text-white hover:brightness-90 font-normal text-2xl py-4 px-10 rounded-lg mb-4 transition-all"
        onClick={() => navigate("/login")}
      >
        Book Appointment
      </button>

      {/* Linki */}
      <p className="text-lg text-[#000200]">
        <span
          className="text-[#cd6c60] font-medium hover:underline cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Sign In
        </span>{" "}
        /{" "}
        <span
          className="text-[#cd6c60] font-medium hover:underline cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}
