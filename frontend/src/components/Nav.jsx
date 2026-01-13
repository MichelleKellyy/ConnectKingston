import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const FAVORITES_KEY = "connectkingston_favorites_v1";

function getFavoritesCount() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [favCount, setFavCount] = useState(getFavoritesCount());

  // Update favorites count when localStorage changes
  useEffect(() => {
    const handler = () => setFavCount(getFavoritesCount());
    window.addEventListener("storage", handler);

    // also update count whenever the page regains focus
    const focusHandler = () => setFavCount(getFavoritesCount());
    window.addEventListener("focus", focusHandler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", focusHandler);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  const linkClass = ({ isActive }) =>
    [
      "rounded-2xl px-3 py-2 text-sm font-semibold transition",
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-700 hover:bg-slate-100",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold tracking-tight text-slate-900"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
            CK
          </span>
          <span>ConnectKingston</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-2">
          {user && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/feed" className={linkClass}>
                Feed
              </NavLink>

              <NavLink to="/favourites" className={linkClass}>
                <span className="flex items-center gap-2">
                  Favourites
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {favCount}
                  </span>
                </span>
              </NavLink>
            </>
          )}

          {/* Right side auth buttons */}
          {!user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                to="/signin"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800
                           hover:bg-slate-50 transition"
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white
                           hover:bg-indigo-500 transition active:scale-[0.98] shadow-sm"
              >
                Get started
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="ml-2 rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700
                         hover:bg-red-50 transition active:scale-[0.98]"
            >
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
