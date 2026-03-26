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
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 👉 Save extra user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      age: Number(age),
      role: age < 13 ? "child" : "user",
      preferredMode: "study"
    });

    // 🔥 SAVE NAME LOCALLY
    localStorage.setItem("username", name);

    alert("User registered successfully ✅");

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
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="number"
        placeholder="Enter age"
        onChange={(e) => setAge(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  </div>
);
}

export default Register;