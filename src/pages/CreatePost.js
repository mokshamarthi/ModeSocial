import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function CreatePost({ setPage }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Auto-fill name if saved
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setName(storedName);
  }, []);

  const handleUpload = async () => {
    console.log("Upload clicked");

    if (!file) {
      alert("Please select a video");
      return;
    }

    if (!name) {
      alert("Please enter your name");
      return;
    }

    try {
      setLoading(true);
      console.log("Uploading to Cloudinary...");

      // 🔥 Upload to Cloudinary
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

      console.log("Cloudinary response:", result);

      if (result.error) {
        throw new Error(result.error.message);
      }

      const videoUrl = result.secure_url;

      console.log("Cloudinary URL:", videoUrl);

      // 💾 Save to Firestore
      await addDoc(collection(db, "posts"), {
        videoUrl,
        caption,
        mode,
        minAge: minAge ? Number(minAge) : 0,
        maxAge: maxAge ? Number(maxAge) : 100,
        createdAt: new Date(),
        name: name // ✅ FIXED
      });

      // 🔥 Save name locally for next time
      localStorage.setItem("username", name);

      alert("Reel uploaded successfully 🎬");

      setPage("dashboard");

    } catch (error) {
      console.error("FULL ERROR:", error);
      alert(error.message || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Upload Reel 🎬</h2>

        {/* 👤 NAME */}
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        {/* 🎂 AGE FILTER */}
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
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Reel"}
        </button>
      </div>
    </div>
  );
}

export default CreatePost;