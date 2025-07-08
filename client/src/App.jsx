import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SelectTime from "./pages/SelectTime";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* <-- Landing Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/select-time" element={<SelectTime />} />
      </Routes>
    </Router>
  );
}

export default App;
