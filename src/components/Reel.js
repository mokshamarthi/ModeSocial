import { useRef, useEffect, useState } from "react";

function Reel({ post }) {
  const videoRef = useRef();
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  const addComment = () => {
    if (text.trim() === "") return;
    setComments([...comments, text]);
    setText("");
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      
      <video
        ref={videoRef}
        src={post.videoUrl}
        loop
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <button
        onClick={() => setLiked(!liked)}
        style={{
          position: "absolute",
          right: "20px",
          bottom: "100px",
          fontSize: "20px"
        }}
      >
        {liked ? "❤️" : "🤍"}
      </button>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: "white"
        }}
      >
        <p>{post.caption}</p>

        <input
          placeholder="Add comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addComment}>Post</button>

        {comments.map((c, i) => (
          <p key={i}>💬 {c}</p>
        ))}
      </div>
    </div>
  );
}

export default Reel;