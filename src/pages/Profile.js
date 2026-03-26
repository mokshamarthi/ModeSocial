import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

function Profile({ selectedUserUid }) {
  const [posts, setPosts] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");

  // ✅ Get UID (own or other user)
  const currentUid =
    selectedUserUid || localStorage.getItem("uid");

  // 🔥 Fetch posts using UID
  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));

      const allPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const userPosts = allPosts.filter(
        post => post.uid === currentUid
      );

      setPosts(userPosts);
    };

    if (currentUid) fetchPosts();
  }, [currentUid]);

  // 🔥 Fetch user data (profile pic + username)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!currentUid) return;

        const userDoc = await getDoc(doc(db, "users", currentUid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfilePic(data.profilePic || null);
          setUsername(data.username || "");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [currentUid]);

  // 📸 Upload profile pic (only own profile)
  const handleProfilePic = async (e) => {
    if (selectedUserUid) return;

    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "profile");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drdyvdsze/image/upload",
        {
          method: "POST",
          body: data
        }
      );

      const result = await res.json();
      const imageUrl = result.secure_url;

      await updateDoc(doc(db, "users", currentUid), {
        profilePic: imageUrl
      });

      setProfilePic(imageUrl);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔥 PROFILE HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px"
        }}
      >
        {/* 👤 PROFILE PIC */}
        <label style={{ cursor: selectedUserUid ? "default" : "pointer" }}>
          <img
            src={
              profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />

          {!selectedUserUid && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePic}
              style={{ display: "none" }}
            />
          )}
        </label>

        {/* 👤 USER INFO */}
        <div>
          <h2>{username}</h2>
          <p>Posts: {posts.length}</p>
        </div>
      </div>

      {/* 🎬 POSTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px"
        }}
      >
        {posts.map(post => (
          <video
            key={post.id}
            src={post.videoUrl}
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
              cursor: "pointer"
            }}
            muted
            onClick={() => setSelectedVideo(post.videoUrl)}
          />
        ))}
      </div>

      {/* 🎬 FULL SCREEN VIDEO */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <video
            src={selectedVideo}
            controls
            autoPlay
            style={{ width: "60%" }}
          />
        </div>
      )}
    </div>
  );
}

export default Profile;