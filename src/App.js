import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ModeSelect from "./pages/ModeSelect";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ReelsPage from "./pages/ReelsPage";

function App() {
  const [page, setPage] = useState("login");
  const [mode, setMode] = useState("all");

  // ✅ UID BASED
  const [selectedUserUid, setSelectedUserUid] = useState(null);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

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
            
            {/* 🏠 HOME */}
            <button
              onClick={() => {
                setMode("all");
                setSelectedUserUid(null); // ✅ reset
                setPage("dashboard");
              }}
            >
              🏠 Home
            </button>

            {/* 🎬 REELS */}
            <button
              onClick={() => {
                setSelectedUserUid(null);
                setPage("reels");
              }}
            >
              🎬 Reels
            </button>

            {/* 🎯 MODE */}
            <button onClick={() => setPage("mode")}>
              🎯 Select Mode
            </button>

            {/* ➕ CREATE */}
            <button onClick={() => setPage("create")}>
              ➕ Create Reel
            </button>

            {/* 👤 PROFILE */}
            <button
              onClick={() => {
                setSelectedUserUid(null); // own profile
                setPage("profile");
              }}
            >
              👤 Profile
            </button>

            {/* 🛠 ADMIN */}
            {isAdmin && (
              <button onClick={() => setPage("admin")}>
                🛠 Admin
              </button>
            )}

            {/* 🚪 LOGOUT */}
            <button
              onClick={() => {
                localStorage.clear(); // 🔥 better
                setSelectedUserUid(null);
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

      {/* 📱 MAIN CONTENT */}
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
          <Dashboard
            mode={mode}
            setPage={setPage}
            setSelectedUserUid={setSelectedUserUid} // ✅ FIXED
          />
        )}

        {/* 🎬 REELS */}
        {page === "reels" && (
          <ReelsPage
            setPage={setPage}
            setSelectedUserUid={setSelectedUserUid} // ✅ FIXED
          />
        )}

        {/* CREATE */}
        {page === "create" && (
          <>
            <CreatePost setPage={setPage} />
            <button onClick={() => setPage("dashboard")}>
              Back
            </button>
          </>
        )}

        {/* PROFILE */}
        {page === "profile" && (
          <Profile selectedUserUid={selectedUserUid} /> // ✅ FIXED
        )}

        {/* ADMIN */}
        {page === "admin" && <Admin />}
      </div>
    </div>
  );
}

export default App;