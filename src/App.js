import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ModeSelect from "./pages/ModeSelect";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

function App() {
  const [page, setPage] = useState("login");
  const [mode, setMode] = useState("all");

  return (
    <div>

      {/* 🔝 NAVBAR */}
      {page !== "login" && page !== "register" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            background: "black",
            color: "white"
          }}
        >
          <h2>ModeSocial 🚀</h2>

          <div style={{ display: "flex", gap: "15px" }}>
            <button onClick={() => setPage("dashboard")}>🏠 Home</button>
            <button onClick={() => setPage("mode")}>🎯 Select Mode</button>
            <button onClick={() => setPage("create")}>➕ Create Reel</button>
            <button onClick={() => setPage("profile")}>👤 Profile</button>

            <button
              onClick={() => {
                localStorage.removeItem("username");
                setPage("login");
                setMode("all");
              }}
              style={{ background: "red", color: "white" }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center" }}>
        <h1>ModeSocial 🚀</h1>

        {/* LOGIN */}
        {page === "login" && (
          <>
            <Login
              setPage={() => {
                setMode("all");
                setPage("dashboard");
              }}
            />
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

        {/* MODE */}
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
          <Dashboard mode={mode} setPage={setPage} />
        )}

        {/* CREATE */}
        {page === "create" && (
          <>
            <CreatePost setPage={setPage} />
            <button onClick={() => setPage("dashboard")}>Back</button>
          </>
        )}

        {/* ✅ PROFILE FIXED */}
        {page === "profile" && <Profile />}
      </div>
    </div>
  );
}

export default App;