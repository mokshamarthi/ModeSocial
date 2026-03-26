import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

function Dashboard({ mode, setPage }) {
  const [posts, setPosts] = useState([]);
  const videoRefs = useRef([]);

  const userAge = 20;
  const username = localStorage.getItem("username");

  // 🔥 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));

      const allPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // ✅ FILTER (All + Mode + Age)
      const filtered = allPosts.filter(post =>
        (!mode || mode === "all" || post.mode === mode) &&
        userAge >= (post.minAge ?? 0) &&
        userAge <= (post.maxAge ?? 100)
      );

      setPosts(filtered);
    };

    fetchPosts();
  }, [mode]);

  // 🎬 Auto play
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.play();
          } else {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [posts]);

  // ❤️ LIKE
  const handleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);

    if (post.likes && post.likes.includes(username)) {
      alert("Already liked ❤️");
      return;
    }

    try {
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likes: [...(p.likes || []), username] }
            : p
        )
      );

      await updateDoc(doc(db, "posts", postId), {
        likes: arrayUnion(username)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 💬 COMMENT
  const handleComment = async (postId, text) => {
    if (!text) return;

    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion({ user: username, text })
      });

      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? {
                ...p,
                comments: [...(p.comments || []), { user: username, text }]
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔗 SHARE
  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert("Link copied 🔗");
  };

  return (
    <div style={{ height: "90vh", overflowY: "scroll" }}>
      

      {/* 🔥 POSTS */}
      {posts.map((post, index) => (
        <div
          key={post.id}
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            background: "white"
          }}
        >
          {/* 👤 NAME */}
          <p style={{ fontWeight: "bold" }}>
            {post.name || "Unknown"}
          </p>

          {/* 🎬 VIDEO */}
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={post.videoUrl}
            style={{ height: "50%", width: "50%", borderRadius: "10px" }}
            muted
            loop
            controls
          />

          {/* ❤️ 💬 🔗 */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => handleLike(post.id)}>
              ❤️ {post.likes?.length || 0}
            </button>

            <input
              placeholder="Add comment"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleComment(post.id, e.target.value);
                  e.target.value = "";
                }
              }}
            />

            <button onClick={() => handleShare(post.videoUrl)}>
              🔗
            </button>
          </div>

          {/* 💬 COMMENTS */}
          <div style={{ marginTop: "10px" }}>
            {post.comments?.map((c, i) => (
              <p key={i}>
                <b>{c.user}:</b> {c.text}
              </p>
            ))}
          </div>

          {/* 📝 CAPTION */}
          <div
            style={{
              position: "absolute",
              bottom: "20px"
            }}
          >
            <p>{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;