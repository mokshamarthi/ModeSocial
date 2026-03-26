import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

function Profile() {
  const [posts, setPosts] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const username = localStorage.getItem("username");

  // 🔥 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));

      const allPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const userPosts = allPosts.filter(
        post =>
          post.name &&
          username &&
          post.name.toLowerCase() === username.toLowerCase()
      );

      setPosts(userPosts);
    };

    fetchPosts();
  }, [username]);

  // 🔥 Fetch profile pic
  useEffect(() => {
    const fetchProfilePic = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setProfilePic(userDoc.data().profilePic || null);
      }
    };

    fetchProfilePic();
  }, []);

  // 🔥 Compress + crop image
  const processImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height); // square crop

        canvas.width = 300;
        canvas.height = 300;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          300,
          300
        );

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.7 // 🔥 compression quality
        );
      };

      reader.readAsDataURL(file);
    });
  };

  // 📸 Upload to Cloudinary
  const handleProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const processedImage = await processImage(file);

      const data = new FormData();
      data.append("file", processedImage);
      data.append("upload_preset", "profile"); // 🔥 replace
      data.append("cloud_name", "drdyvdsze");       // 🔥 replace

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        {
          method: "POST",
          body: data
        }
      );

      const result = await res.json();
      const imageUrl = result.secure_url;

      // 💾 Save in Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
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
        <label style={{ cursor: "pointer" }}>
          <img
            src={
              profilePic ||
              "https://via.placeholder.com/100?text=Upload"
            }
            alt="profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid black"
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePic}
            style={{ display: "none" }}
          />
        </label>

        {/* 👤 USER INFO */}
        <div>
          <h2>{username}</h2>
          <p>Posts: {posts.length}</p>
        </div>
      </div>

      {/* 🎬 REELS GRID */}
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

      {/* 🎬 FULL SCREEN PLAYER */}
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
            alignItems: "center",
            zIndex: 2000
          }}
        >
          <video
            src={selectedVideo}
            controls
            autoPlay
            style={{
              width: "60%",
              borderRadius: "10px"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Profile;