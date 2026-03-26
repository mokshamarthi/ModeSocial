import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

function Dashboard({ mode, setPage, setSelectedUserUid }) {
  const [posts, setPosts] = useState([]);
  const videoRefs = useRef([]);

  const userAge = Number(localStorage.getItem("age")) || 20;
  const username = localStorage.getItem("username");

  // 🔥 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));

      const allPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const filtered = allPosts.filter(post =>
        (!mode || mode === "all" || post.mode === mode) &&
        userAge >= (post.minAge ?? 0) &&
        userAge <= (post.maxAge ?? 100) &&
        (post.reports || 0) < 5
      );

      setPosts(filtered);
    };

    fetchPosts();
  }, [mode, userAge]);

  // 🎬 Auto play
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
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

    if (post?.likes?.includes(username)) {
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
    if (!text.trim()) return;

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

  // 🚨 REPORT
  const handleReport = async (postId, currentReports = 0) => {
    try {
      await updateDoc(doc(db, "posts", postId), {
        reports: currentReports + 1,
        reported: true
      });

      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, reports: (p.reports || 0) + 1 }
            : p
        )
      );

      alert("Reported 🚨");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: "90vh", overflowY: "scroll" }}>
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
            background: "#f9f9f9"
          }}
        >
          {/* 👤 USERNAME */}
          <p
            style={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => {
              setSelectedUserUid(post.uid);
              setPage("profile");
            }}
          >
            {post.username || post.name || "Unknown"}
          </p>

          {/* 🎬 VIDEO */}
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={post.videoUrl}
            style={{
              height: "50%",
              width: "50%",
              borderRadius: "10px"
            }}
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

          {/* 🚨 REPORT BUTTON (FIXED VISIBILITY) */}
          <button
            onClick={() => handleReport(post.id, post.reports || 0)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              zIndex: 10, // 🔥 FIX
              cursor: "pointer"
            }}
          >
            🚨 Report
          </button>

          {/* ⚠️ UNDER REVIEW */}
          {post.reports > 3 && (
            <p
              style={{
                position: "absolute",
                top: "60px",
                right: "20px",
                color: "orange",
                fontWeight: "bold",
                zIndex: 10
              }}
            >
              ⚠️ Under Review
            </p>
          )}

          {/* 💬 COMMENTS */}
          <div style={{ marginTop: "10px" }}>
            {post.comments?.map((c, i) => (
              <p key={i}>
                <b>{c.user}:</b> {c.text}
              </p>
            ))}
          </div>

          {/* 📝 CAPTION */}
          <div style={{ position: "absolute", bottom: "20px" }}>
            <p>{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;