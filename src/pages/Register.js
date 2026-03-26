import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");

  const handleRegister = async () => {
    // 🔒 Basic validation
    if (!name || !email || !password || !age) {
      alert("Please fill all fields ⚠️");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const numericAge = Number(age);

      // ✅ Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email,
        age: numericAge,
        role: numericAge < 13 ? "child" : "user",
        preferredMode: "study",
        createdAt: new Date()
      });

      // ✅ Store username locally (for profile + posts)
      localStorage.setItem("username", name.trim());
      localStorage.setItem("age", numericAge);

      alert("User registered successfully ✅");

      // 🔄 Clear inputs
      setName("");
      setEmail("");
      setPassword("");
      setAge("");

      // 👉 Go to login
      setPage("login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Register;