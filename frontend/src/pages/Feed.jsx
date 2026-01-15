import { useEffect, useMemo, useState } from "react";
import Nav from "../components/Nav";

const FAVORITES_KEY = "connectkingston_favorites_v1";


    /*id: "4",
    title: "Event Support Volunteer",
    org: "Kingston Arts Council",
    location: "City Hall",
    commitment: "One-time / flexible",
    tags: ["Events", "Arts", "Community"],
    description:
      "Help with check-in, guiding attendees, and setup/teardown at local events.",*/

async function fetchOpportunities() {
  const res = await fetch(`http://localhost:8000/opportunities/unmatched?limit=${50}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.items;
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

  // NEW: toggle between "matched" feed and "all/unmatched" feed
  // - matched: you will plug your AI matching output into `matchedOpportunities`
  // - unmatched: shows ALL opportunities (your request)
  const [feedView, setFeedView] = useState("matched"); // "matched" | "all"

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

  // ✅ PLACEHOLDER: This is where your AI matched list goes.
  // Option A (IDs): const matchedIds = new Set([...])
  // Option B (objects): const matchedOpportunities = [...]
  //
  // Right now it returns an empty array so "matched" feed shows none until you wire it.
  const matchedOpportunities = useMemo(() => {
    // TODO: replace this with your AI output
    // Example using IDs:
    // const matchedIds = new Set(["1","3"]);
    // return opportunities.filter(o => matchedIds.has(o.id));
    return [];
  }, [opportunities]);

  // base list depends on feedView
  const baseList = useMemo(() => {
    return feedView === "matched" ? matchedOpportunities : opportunities;
  }, [feedView, matchedOpportunities, opportunities]);

  // apply search on top of whichever list is active
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return baseList;

    return baseList.filter((o) => {
      const haystack = [
        o.title,
        o.organization,
        o.description,
        o.raw?.availability,
        o.raw?.group,         // nice for Providence Care sections
        o.source,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [baseList, query]);

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
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
              Volunteer Feed
            </h1>
            <p className="mt-2 text-slate-600">
              Browse opportunities and favorite the ones you like.
            </p>
          </div>

          {/* Search + Toggle button */}
          <div className="w-full sm:w-[32rem]">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700">
                  Search
                </label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try: youth, environment, downtown..."
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3
                             outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setFeedView((v) => (v === "matched" ? "all" : "matched"))
                }
                className="h-[50px] whitespace-nowrap rounded-2xl border border-slate-200 bg-white px-4 font-semibold
                           text-slate-800 shadow-sm hover:bg-slate-50 transition active:scale-[0.98]"
              >
                {feedView === "matched" ? "Show all" : "Show matched"}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Viewing:{" "}
              <span className="font-semibold text-slate-700">
                {feedView === "matched"
                  ? "Matched feed (AI)"
                  : "All opportunities (unmatched)"}
              </span>
            </p>
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
              {feedView === "matched"
                ? "No matched opportunities yet. Try 'Show all'."
                : "Try a different search term."}
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((opp) => {
              const id = opp._id || opp.source_id; // _id is string from your pipeline
              return (
              <OpportunityCard
                key={id}
                opp={opp}
                isFavorited={favorites.has(id)}
                onToggleFavorite={() => toggleFavorite(id)}
                onClick={() => {
                  console.log("Clicked opportunity", id);
                }}
              />
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function OpportunityCard({ opp, onClick, isFavorited, onToggleFavorite }) {
  const availability = opp?.raw?.availability;
  const org = opp?.organization || "Unknown organization";
  const title = opp?.title || "Untitled";
  const desc = opp?.description || "";
  const applyUrl = opp?.apply_url;

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
          e.stopPropagation();
          onToggleFavorite?.();
        }}
        className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm
                   shadow-sm hover:bg-slate-50 transition"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <span className={isFavorited ? "text-yellow-400" : "text-slate-400"}>
          {isFavorited ? "★" : "☆"}
        </span>
      </button>

      <div className="flex items-start justify-between gap-3 pr-10">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{org}</p>
        </div>

        {/* Use availability (if present) like your old "commitment" pill */}
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {availability || "Flexible"}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600 line-clamp-3">
        {desc}
      </p>

      {/* Optional: show Providence Care group header if you save it in raw.group */}
      {opp?.raw?.group && (
        <div className="mt-4">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
            {opp.raw.group}
          </span>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="text-slate-400">🔗</span>
          {opp?.source || "source"}
        </span>

      <a
          href={applyUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
        <span className="font-semibold text-indigo-700 group-hover:text-indigo-600">
          View →
        </span>
        </a>
      </div>
    </div>
  );
}