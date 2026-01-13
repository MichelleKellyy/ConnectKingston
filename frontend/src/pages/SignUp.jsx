import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebase";

import bg from "../assets/img1.png";

export default function SignUp() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState(""); // optional for now (UI only)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // UX state
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1) Wait until auth state is known
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

  // 2) If already logged in, send to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Tiny validation (hackathon-friendly)
    if (!email || !password) {
      setError("Please enter an email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (confirm && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // Optional: later you can store `name` in Firestore under users/{uid}
      navigate("/dashboard");
    } catch (err) {
      // Firebase errors can be a bit ugly; keep it simple for now
      setError(err?.message || "Something went wrong. Try again.");
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
                {/* Pill */}
                <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
                  Connect • Volunteer • Build community
                </p>

                <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                  Create your account
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Get started now — finish your profile after.
                </p>

                {/* Error message */}
                {error && (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Name (optional) */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Name <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900
                                 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900
                                 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900
                                 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Use 6+ characters.
                    </p>
                  </div>

                  {/* Confirm password (optional but nice) */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Confirm password <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
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
                    {submitting ? "Creating…" : "Create account"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="font-semibold text-indigo-700 hover:text-indigo-600"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

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