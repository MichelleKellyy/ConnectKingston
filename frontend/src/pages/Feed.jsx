import { useEffect, useMemo, useState } from "react";
import Nav from "../components/Nav";

const FAVORITES_KEY = "connectkingston_favorites_v1";

// Mock data for hackathon UI.
// Replace fetchOpportunities() with your API call later.
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
  // Later: replace with API call
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_OPPORTUNITIES;
}

// LocalStorage helpers
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

export default function Feed() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");

  // favorites are a Set of ids for fast lookups
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return opportunities;

    return opportunities.filter((o) => {
      const haystack = [
        o.title,
        o.org,
        o.location,
        o.commitment,
        ...(o.tags || []),
        o.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [opportunities, query]);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavorites(next);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
              Opportunities
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
              Volunteer Feed
            </h1>
            <p className="mt-2 text-slate-600">
              Browse opportunities and favorite the ones you like.
            </p>

            <p className="mt-3 text-sm text-slate-600">
              Favorites:{" "}
              <span className="font-semibold text-indigo-700">
                {favorites.size}
              </span>
              {" "}
              <span className="text-slate-400">(see /favorites)</span>
            </p>
          </div>

          {/* Search */}
          <div className="w-full sm:w-80">
            <label className="text-sm font-medium text-slate-700">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: youth, environment, downtown..."
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3
                         outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-900">Loading opportunities…</p>
            <p className="mt-1 text-sm text-slate-600">Hang tight.</p>
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">Couldn’t load opportunities</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-900">No results</p>
            <p className="mt-1 text-sm text-slate-600">
              Try a different search term.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                isFavorited={favorites.has(opp.id)}
                onToggleFavorite={() => toggleFavorite(opp.id)}
                onClick={() => {
                  // Later: route to /opportunity/:id or open modal
                  console.log("Clicked opportunity", opp.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OpportunityCard({ opp, onClick, isFavorited, onToggleFavorite }) {
  return (
    <div
      className="group relative cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm
                 transition hover:-translate-y-1 hover:shadow-md"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.();
      }}
    >
      {/* Favorite button (top-right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // prevents triggering card click
          onToggleFavorite?.();
        }}
        className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm
                   shadow-sm hover:bg-slate-50 transition"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <span className={isFavorited ? "text-red-600" : "text-slate-400"}>
          {isFavorited ? "♥" : "♡"}
        </span>
      </button>

      <div className="flex items-start justify-between gap-3 pr-10">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{opp.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{opp.org}</p>
        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {opp.commitment || "Flexible"}
        </span>
      </div>

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

        <span className="font-semibold text-indigo-700 group-hover:text-indigo-600">
          View →
        </span>
      </div>
    </div>
  );
}
