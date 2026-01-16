import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import bg from "../assets/img2.jpg";

// Fetch all favorite opportunities (backend now returns full objects)
async function fetchLikedOpportunities(userId) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json(); // Backend returns full opportunity objects directly
}

// Remove favorite from backend
async function removeFavoriteBackend(userId, opportunityId) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/remove_favorite`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, opportunity_id: opportunityId }),
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
}

export default function Favorites({ userId }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadFavorites() {
      setLoading(true);
      setError("");
      try {
        const opps = await fetchLikedOpportunities(userId);
        if (!ignore) setOpportunities(opps);
      } catch (err) {
        if (!ignore) setError(err.message || "Something went wrong.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadFavorites();
    return () => { ignore = true; };
  }, [userId]);

  // Remove favorite (UI + backend)
  async function removeFavorite(id) {
    try {
      await removeFavoriteBackend(userId, id);
      setOpportunities((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      alert("Failed to remove favorite. Please try again.");
    }
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen bg-slate-100/80 backdrop-blur-sm text-slate-900">
        <Nav />

        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
            Your Favourites
          </h1>
          <p className="mt-2 text-slate-600">
            Saved opportunities you can come back to later.
          </p>

          {loading && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="font-semibold text-slate-900">Loading favorites…</p>
              <p className="mt-1 text-sm text-slate-600">One sec.</p>
            </div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-semibold">Couldn't load favorites</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && opportunities.length === 0 && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="font-semibold text-slate-900">No favorites yet</p>
              <p className="mt-1 text-sm text-slate-600">
                Go to the Feed and tap the 🤍 to save opportunities.
              </p>
            </div>
          )}

          {!loading && !error && opportunities.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opp) => (
                <FavoriteCard
                  key={opp._id}
                  opp={opp}
                  onRemove={() => removeFavorite(opp._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// FavoriteCard component (same layout and styles as before)
function FavoriteCard({ opp, onRemove }) {
  const availability = opp?.raw?.availability || "Flexible";
  const org = opp?.organization || "Unknown organization";
  const title = opp?.title || "Untitled";
  const desc = opp?.description || "";
  const applyUrl = opp?.apply_url;

  return (
    <div
      className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm
                 transition hover:-translate-y-1 hover:shadow-md
                 flex h-full flex-col"
    >
      {/* TOP-RIGHT CONTROLS */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        {/* Availability badge */}
        <span className="relative group/badge">
          <span
            className="
              inline-flex h-9 w-9 items-center justify-center
              rounded-full border border-slate-200 bg-white
              shadow-sm transition
              group-hover/badge:bg-slate-50
            "
            aria-hidden="true"
          >
            🗓️
          </span>
          <span
            className="
              pointer-events-none absolute right-0 top-0 z-20
              origin-top-right
              rounded-2xl bg-white px-3 py-2
              text-[11px] font-semibold text-indigo-700 leading-tight
              shadow-md ring-1 ring-slate-200
              opacity-0 scale-95 translate-y-1
              transition duration-300 ease-out
              group-hover/badge:opacity-100
              group-hover/badge:scale-100
              group-hover/badge:translate-y-0
            "
            style={{ width: "max-content", maxWidth: 240 }}
          >
            <span className="inline-flex items-start gap-2">
              🗓️ <span className="whitespace-normal break-words">{availability}</span>
            </span>
          </span>
        </span>

        {/* Remove favorite button */}
        <button
          type="button"
          onClick={onRemove}
          className="
            inline-flex h-9 w-9 items-center justify-center
            rounded-full border border-slate-200 bg-white
            shadow-sm transition
            hover:bg-slate-50 active:scale-95
          "
          aria-label="Remove from favorites"
          title="Remove from favorites"
        >
          <span className="text-red-500">❤️</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pr-24">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-slate-600 flex-1">
        <span className="line-clamp-3 sm:line-clamp-4">{desc}</span>
      </p>

      {/* Bottom row */}
      <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="text-slate-400">🏢</span>
          {org}
        </span>

        {applyUrl && (
          <a
            href={applyUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-indigo-700 group-hover:text-indigo-600"
          >
            View ➜
          </a>
        )}
      </div>
    </div>
  );
}
