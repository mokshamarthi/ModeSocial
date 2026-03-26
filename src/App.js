import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ModeSelect from "./pages/ModeSelect";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";

function App() {
  const [page, setPage] = useState("login");
  const [mode, setMode] = useState("");

  return (
    <div>

      {/* Navbar */}
      {page !== "login" && page !== "register" && (
        <div className="navbar">
          <h2>ModeSocial 🚀</h2>
          <button onClick={() => setPage("login")}>Logout</button>
        </div>
      )}

      <div style={{ textAlign: "center" }}>
        <h1>ModeSocial 🚀</h1>

        {/* LOGIN */}
        {page === "login" && (
          <>
            <Login setPage={setPage} />
            <button onClick={() => setPage("register")}>
              New user? Register
            </button>
          </>
        )}

        {/* REGISTER */}
        {page === "register" && (
          <>
            <Register setPage={setPage} />
            <button onClick={() => setPage("login")}>
              Already have account? Login
            </button>
          </>
        )}

        {/* MODE SELECT */}
        {page === "mode" && (
          <ModeSelect
            setMode={(m) => {
              setMode(m);
              setPage("dashboard");
            }}
          />
        )}

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <button onClick={() => setPage("create")}>
              + Create Reel
            </button>

            {/* ✅ PASS setPage */}
            <Dashboard mode={mode} setPage={setPage} />
          </>
        )}

        {/* CREATE POST */}
        {page === "create" && (
          <>
            <CreatePost setPage={setPage} />
            <button onClick={() => setPage("dashboard")}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;