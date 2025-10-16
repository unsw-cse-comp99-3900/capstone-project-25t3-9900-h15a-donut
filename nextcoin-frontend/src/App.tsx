import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #a2c8ff, #f9fbff)",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#0f172a" }}>
        Welcome to NextCoin
      </h1>
    </div>
  );
}

export default App;
