import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function SignUp() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (loading) {
        return <h1>Checking login...</h1>
    }

    if (user) {
        return (
            <Navigate to="/dashboard" replace />
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSubmitting(false);
        }
    }

  return (
    <div style={{ padding: 20 }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={submitting}>
            {submitting ? "Creating" : "Create Account"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>

    </div>
  );
}