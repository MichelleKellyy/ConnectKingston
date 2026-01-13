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
        <div
          className="flex items-center gap-2 font-extrabold tracking-tight text-slate-900"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
            🤝
          </span>
          <span>ConnectKingston</span>
        </div>

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
                </span>
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
