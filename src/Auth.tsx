import { useState } from "react";
import { supabase } from "./supabase";

export default function Auth({ setUser }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (!error) setUser(data.user);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) setUser(data.user);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>{isSignup ? "Create account" : "Welcome back"}</h1>

        <p className="auth-sub">
          {isSignup
            ? "Start managing your tasks"
            : "Sign in to continue"}
        </p>

        <div className="auth-inputs">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-btn" onClick={handleAuth}>
          {isSignup ? "Sign up" : "Sign in"}
        </button>

        <p className="switch">
          {isSignup ? "Already have an account?" : "New here?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Sign in" : " Create account"}
          </span>
        </p>

      </div>

    </div>
  );
}