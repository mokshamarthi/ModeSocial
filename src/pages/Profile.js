import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Profile() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));

      const myPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPosts(myPosts);
    };

    fetchMyPosts();
  }, []);

  return (
    <div>
      <h2>My Profile 👤</h2>

      {posts.map(post => (
        <div key={post.id}>
          <video src={post.videoUrl} width="200" controls />
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;