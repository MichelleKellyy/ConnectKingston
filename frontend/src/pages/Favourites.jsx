import { useEffect, useMemo, useState } from "react";
import Nav from "../components/Nav";
import bg from "../assets/img2.jpg"; // ✅ ADDED (use the same image as your Feed)

const FAVORITES_KEY = "connectkingston_favorites_v1";

// Same mock + fetch as Feed for now.
// Later: use your API or share a fetch function between pages.
const MOCK_OPPORTUNITIES = [
  {
    id: "1",
    title: "Community Cleanup Volunteer",
    org: "Kingston Green Team",
    location: "Downtown Kingston",
    commitment: "2–4 hrs/week",
    tags: ["Environment", "Outdoors", "Community"],
    description:
      "Help keep Kingston beautiful by joining weekend cleanups and community events.",
  },
  {
    id: "2",
    title: "Food Bank Sorting Helper",
    org: "Kingston Food Bank",
    location: "East End",
    commitment: "1–2 hrs/week",
    tags: ["Food", "Community", "Support"],
    description:
      "Assist with sorting donations and preparing food hampers for local families.",
  },
  {
    id: "3",
    title: "Youth Coding Mentor",
    org: "Tech for Youth",
    location: "Hybrid",
    commitment: "5–10 hrs/month",
    tags: ["Youth", "Tech", "Mentorship"],
    description:
      "Mentor students during coding club sessions. Beginners welcome—training provided.",
  },
  {
    id: "4",
    title: "Event Support Volunteer",
    org: "Kingston Arts Council",
    location: "City Hall",
    commitment: "One-time / flexible",
    tags: ["Events", "Arts", "Community"],
    description:
      "Help with check-in, guiding attendees, and setup/teardown at local events.",
  },
];

async function fetchOpportunities() {
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_OPPORTUNITIES;
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveFavorites(favSet) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favSet]));
}

export default function Favorites() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(() => loadFavorites());

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchOpportunities();
        if (!ignore) setOpportunities(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError(err?.message || "Something went wrong.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const favoritedOpps = useMemo(() => {
    return opportunities.filter((o) => favorites.has(o.id));
  }, [opportunities, favorites]);

  function removeFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(id);
      saveFavorites(next);
      return next;
    });
  }

  return (
    // ✅ CHANGED: background image wrapper
    <div
      className="min-h-screen bg-fixed bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* ✅ CHANGED: overlay layer */}
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
              <p className="font-semibold">Couldn’t load favorites</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && favoritedOpps.length === 0 && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="font-semibold text-slate-900">No favorites yet</p>
              <p className="mt-1 text-sm text-slate-600">
                Go to the Feed and tap the 🤍 to save opportunities.
              </p>
            </div>
          )}

          {!loading && !error && favoritedOpps.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favoritedOpps.map((opp) => (
                <FavoriteCard
                  key={opp.id}
                  opp={opp}
                  onRemove={() => removeFavorite(opp.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
      <p className="mt-1 text-sm text-slate-600">{opp.org}</p>

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
          {opp.location || "Unknown"}
        </span>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {opp.commitment || "Flexible"}
        </span>
      </div>
    </div>
  );
}
