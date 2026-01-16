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
  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm
                   shadow-sm hover:bg-slate-50 transition"
        aria-label="Remove from favorites"
        title="Remove from favorites"
      >
        <span className="text-yellow-400">★</span>
      </button>

      <h2 className="text-lg font-bold text-slate-900">{opp.title}</h2>
      <p className="mt-1 text-sm text-slate-600">{opp.organization || opp.org}</p>

      <p className="mt-3 text-sm text-slate-600 line-clamp-3">
        {opp.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(opp.tags || []).slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="text-slate-400">📍</span>
          {opp.location_text || opp.location || "Unknown"}
        </span>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {opp.commitment || "Flexible"}
        </span>
      </div>
    </div>
  );
}