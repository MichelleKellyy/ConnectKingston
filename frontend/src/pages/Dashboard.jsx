import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Nav />
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-900">Loading dashboard…</p>
            <p className="mt-1 text-sm text-slate-600">One sec.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
              Dashboard
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
              Welcome{user?.email ? "," : ""}{" "}
              <span className="text-indigo-700">
                {user?.email ? user.email : "Guest"}
              </span>
            </h1>

            <p className="mt-2 text-slate-600">
              Manage your profile and find opportunities that match you.
            </p>
          </div>

          {/* Log out button */}
          {user && (
            <button
              onClick={handleLogout}
              className="w-fit rounded-2xl border border-red-200 bg-white px-6 py-3 font-semibold text-red-700
                         hover:bg-red-50 transition active:scale-[0.98]"
            >
              Log out
            </button>
          )}
        </div>

        {/* Main content */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {/* Profile card (bigger) */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Your profile</h2>
                <p className="mt-2 text-slate-600">
                  Add your skills, interests, postal code, and time commitment to get better matches.
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                Recommended
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <QuickItem label="Skills" value="Add your skills" />
              <QuickItem label="Interests" value="Choose causes you care about" />
              <QuickItem label="Postal code" value="Help find local matches" />
              <QuickItem label="Commitment" value="Set your weekly hours" />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white
                           hover:bg-indigo-500 transition active:scale-[0.98] shadow-sm"
              >
                Edit profile
              </Link>

              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold
                           hover:bg-slate-50 transition"
              >
                View profile
              </Link>
            </div>
          </div>

          {/* Sidebar card: Opportunities */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold">Opportunities</h2>
            <p className="mt-2 text-slate-600">
              Browse available volunteer roles and save ones you like.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold text-slate-900">Quick actions</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  to="/feed"
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 font-semibold text-white
                             hover:bg-indigo-500 transition"
                >
                  Browse opportunities
                </Link>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 font-semibold
                             hover:bg-slate-50 transition"
                  onClick={() => alert("Hackathon: saved opportunities coming soon!")}
                >
                  View saved (soon)
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Tip: Fill out your profile first for better matches.
            </p>
          </div>

          {/* Optional: a "status" / "completion" bar */}
          <div className="md:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">Profile completeness</p>
                <p className="text-sm text-slate-600">
                  Hackathon version: we’ll calculate this later.
                </p>
              </div>

              <div className="w-full sm:w-80">
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div className="h-2 w-2/5 rounded-full bg-indigo-600" />
                </div>
                <p className="mt-2 text-xs text-slate-500">40% complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* If no user (shouldn’t happen if dashboard is protected) */}
        {!user && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
            You’re not logged in.{" "}
            <Link className="font-semibold underline underline-offset-4" to="/signin">
              Sign in
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}

function QuickItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{value}</p>
    </div>
  );
}
