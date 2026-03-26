import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc
} from "firebase/firestore";

function CreatePost({ setPage }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH USERNAME FROM FIRESTORE (BEST FIX)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uid = localStorage.getItem("uid");
        if (!uid) return;

        const userDoc = await getDoc(doc(db, "users", uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.username || "");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a video");
      return;
    }

    if (!name.trim()) {
      alert("Username missing ❌");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in ❌");
        return;
      }

      const uid = user.uid;

      // 🔥 GET PROFILE PIC
      const userDoc = await getDoc(doc(db, "users", uid));
      let profilePic = "";

      if (userDoc.exists()) {
        profilePic = userDoc.data().profilePic || "";
      }

      // 🔥 Upload video to Cloudinary
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "modesocial");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drdyvdsze/auto/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const videoUrl = result.secure_url;

      // 🔥 SAVE POST
      await addDoc(collection(db, "posts"), {
        videoUrl,
        caption,
        mode,
        minAge: minAge ? Number(minAge) : 0,
        maxAge: maxAge ? Number(maxAge) : 100,
        createdAt: new Date(),

        // 👤 USER DATA
        uid: uid,
        username: name.trim(),
        profilePic: profilePic,

        // ❤️ SOCIAL
        likes: [],
        comments: [],

        // 🚨 REPORT
        reports: 0,
        reported: false
      });

      alert("Reel uploaded successfully 🎬");
      setPage("dashboard");

    } catch (error) {
      console.error(error);
      alert(error.message || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Upload Reel 🎬</h2>

        {/* 👤 NAME (AUTO FILLED) */}
        <input
          placeholder="Your Name"
          value={name}
          readOnly // 🔥 prevent editing (like Instagram)
        />

        {/* 🎬 VIDEO */}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* 📝 CAPTION */}
        <input
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* 🎯 MODE */}
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">Select Mode</option>
          <option value="study">Study</option>
          <option value="devotional">Devotional</option>
          <option value="kids">Kids</option>
          <option value="comedy">Comedy</option>
          <option value="fashion">Fashion</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
        </select>

        {/* 🎂 AGE */}
        <input
          type="number"
          placeholder="Min Age"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Age"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
        />

        {/* 🚀 BUTTON */}
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Reel"}
        </button>
      </div>
    </div>
  );
}

export default CreatePost;