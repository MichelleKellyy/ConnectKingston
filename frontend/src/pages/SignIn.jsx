import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebase";

import bg from "../assets/img1.png";

export default function SignIn() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Wait until we know if the user is logged in
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="font-semibold text-slate-900">Checking login…</p>
          <p className="text-sm text-slate-600">One sec.</p>
        </div>
      </div>
    );
  }

  // If already signed in, go to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // quick validation
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Could not sign in. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Background image */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* Overlay */}
        <div className="min-h-screen bg-black/55">
          <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
              {/* Card */}
              <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5">
                <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                  Sign in
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Welcome back, let’s get you connected.
                </p>

                {/* Error */}
                {error && (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900
                                 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900
                                 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white
                               hover:bg-indigo-500 transition active:scale-[0.98] shadow-sm
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Signing in…" : "Sign in"}
                  </button>
                </form>

                {/* Link to sign up */}
                <p className="mt-6 text-center text-sm text-slate-600">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-indigo-700 hover:text-indigo-600"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Back to home */}
              <p className="mt-4 text-center text-sm text-white/90">
                <Link
                  to="/"
                  className="underline underline-offset-4 hover:text-white"
                >
                  Back to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
