import { useState } from "react";
import { useFirebase } from "../providers/Firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const firebase = useFirebase();

  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="border-2 border-black"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        className="border-2 border-black"
      />
      <button
        onClick={() => firebase.signupUserWithEmailAndPassword(email, password)}
      >
        Sign Up
      </button>
      <button onClick={() => firebase.signInWithGoogle()}>
        sign in with google{" "}
      </button>
    </div>
  );
};

export default Login;
