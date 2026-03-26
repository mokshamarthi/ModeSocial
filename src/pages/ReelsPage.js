import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function ReelsPage({ setPage, setSelectedUserUid }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // 🔥 Fetch data
  useEffect(() => {
    const fetchPosts = async () => {
      const snap = await getDocs(collection(db, "posts"));
      setPosts(snap.docs.map(doc => doc.data()));
    };

    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const userList = snap.docs.map(doc => doc.data());
      setUsers(userList);
    };

    fetchPosts();
    fetchUsers();
  }, []);

  // 🔍 SEARCH USERS (FIXED)
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const filtered = users.filter(user =>
      user.username?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  return (
    <div style={{ padding: "10px" }}>
      
      {/* 🔍 SEARCH BAR */}
      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px"
        }}
      />

      {/* 👤 SEARCH RESULTS */}
      {filteredUsers.map((user, i) => (
        <p
          key={i}
          style={{ cursor: "pointer", padding: "5px" }}
          onClick={() => {
            setSelectedUserUid(user.uid); // ✅ FIXED
            setPage("profile");
          }}
        >
          👤 {user.username} {/* ✅ FIXED */}
        </p>
      ))}

      {/* 🎬 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "5px"
        }}
      >
        {posts.map((post, i) => (
          <video
            key={i}
            src={post.videoUrl}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover"
            }}
            muted
          />
        ))}
      </div>
    </div>
  );
}

export default ReelsPage;