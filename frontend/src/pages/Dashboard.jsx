import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

const DEFAULT_PROFILE = {
  postalCode: "",
  commitmentHours: "",
  skills: [],
  interests: [],
};

function parseCommaList(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function fetchUserProfile(userId) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getuser/${userId}`);
    if (!res.ok) {
      console.error("Failed to fetch profile:", res.status);
      return null;
    }
    const data = await res.json();
    return data.profile || null;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}

async function saveProfileToBackend(user, profile) {
  const payload = {
    user_id: user.uid,
    email: user.email,
    profile: {
      full_name: profile.full_name,
      postal_code: profile.postalCode,
      availability_hours_per_week: profile.commitmentHoursNum,
      skills: profile.skills,
      interests: profile.interests,
    },
  };

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to save profile: ${res.status} ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error saving profile to backend:", err);
    throw err; // re-throw so the calling function can handle it
  }
}

async function saveEditedProfileToBackend(user, profile) {
  const payload = {
    user_id: user.uid,
    email: user.email,
    profile: {
      full_name: profile.full_name,
      postal_code: profile.postalCode,
      availability_hours_per_week: profile.commitmentHoursNum,
      skills: profile.skills,
      interests: profile.interests,
    },
  };

  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/update_user/${user.uid}`, // PUT endpoint
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to update profile: ${res.status} ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error updating profile on backend:", err);
    throw err;
  }
}


export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // profile state
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE });
  const [draft, setDraft] = useState({ ...DEFAULT_PROFILE });
  const [fullNameText, setFullNameText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  // NEW: keep raw text while editing so commas don’t disappear
  const [skillsText, setSkillsText] = useState("");
  const [interestsText, setInterestsText] = useState("");

  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      const profileData = await fetchUserProfile(user.uid);
      if (profileData) {
        // Set profile state
        setProfileExists(true);
        setProfile({
          postalCode: profileData.postal_code || "",
          commitmentHours: profileData.availability_hours_per_week || "",
          skills: profileData.skills || [],
          interests: profileData.interests || [],
          full_name: profileData.full_name || "",
          commitmentHoursNum: profileData.availability_hours_per_week || "",
        });

        // Set draft for editing
        setDraft({
          postalCode: profileData.postal_code || "",
          commitmentHours: profileData.availability_hours_per_week || "",
          skills: profileData.skills || [],
          interests: profileData.interests || [],
          full_name: profileData.full_name || "",
          commitmentHoursNum: profileData.availability_hours_per_week || "",
        });

        // Initialize editable text inputs
        setFullNameText(profileData.full_name || "");
        setSkillsText((profileData.skills || []).join(", "));
        setInterestsText((profileData.interests || []).join(", "));
      }
    }

    loadProfile();
  }, [user]);


  function startEdit() {
    setDraft(profile);

    // NEW: initialize editable text inputs from current profile
    setSkillsText((profile.skills || []).join(", "));
    setInterestsText((profile.interests || []).join(", "));
    setFullNameText(profile.full_name || "");
    setIsEditing(true);
    setSavedMsg("");
    setErrorMsg("");
  }

  function cancelEdit() {
    setDraft(profile);

    // NEW: reset editable text too
    setSkillsText((profile.skills || []).join(", "));
    setInterestsText((profile.interests || []).join(", "));
    setFullNameText(profile.full_name || "");
    setIsEditing(false);
    setSavedMsg("");
    setErrorMsg("");
  }

  function updateDraft(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    setErrorMsg("");

    // Validate mandatory fields
    if (!fullNameText.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }
    if (!draft.commitmentHours) {
      setErrorMsg("Please select weekly commitment hours.");
      return;
    }

    // Prepare nextDraft
    const nextDraft = {
      ...draft,
      full_name: fullNameText.trim(),
      skills: parseCommaList(skillsText),
      interests: parseCommaList(interestsText),
      commitmentHoursNum: draft.commitmentHours,
    };

    setProfile(nextDraft);
    setIsEditing(false);
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 2000);

    // Send to backend: POST if new, PUT if exists
    try {
      if (profileExists) {
        await saveEditedProfileToBackend(user, nextDraft); // PUT
      } else {
        await saveProfileToBackend(user, nextDraft);       // POST
        setProfileExists(true); // mark that profile now exists
      }
    } catch (err) {
      setErrorMsg("Failed to save profile. Make sure all fields are valid.");
    }
  }



  // Completion: 25% for each filled category
  const completion = useMemo(() => {
    let score = 0;

    const hasPostal = Boolean((profile.postalCode || "").trim());
    const hasCommitment = Boolean((profile.commitmentHours || "").trim());
    const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;
    const hasInterests =
      Array.isArray(profile.interests) && profile.interests.length > 0;

    if (hasPostal) score += 25;
    if (hasCommitment) score += 25;
    if (hasSkills) score += 25;
    if (hasInterests) score += 25;

    return score;
  }, [profile]);

  const completionLabel = useMemo(() => {
    if (completion === 0) return "Not started";
    if (completion === 25) return "Good start";
    if (completion === 50) return "Halfway";
    if (completion === 75) return "Almost there";
    return "Complete";
  }, [completion]);

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
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
              Welcome{user?.email ? "," : ""}{" "}
              <span className="text-indigo-700">
                {user?.email ? user.email : "Guest"}
              </span>
            </h1>

            <p className="mt-2 text-slate-600">
              Edit your profile here and browse opportunities.
            </p>
          </div>

          {/* Right actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
        </div>

        {/* saved/error message */}
        <div className="mt-4 flex flex-col gap-2">
          {savedMsg && (
            <div className="w-fit rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              {savedMsg}
            </div>
          )}
          {errorMsg && (
            <div className="w-fit rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {/* Profile editor card (bigger) */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Your profile</h2>
                <p className="mt-2 text-slate-600">
                  Fill these out to get better matches.
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={startEdit}
                  className="rounded-2xl bg-indigo-600 px-5 py-2.5 font-semibold text-white
                             hover:bg-indigo-500 transition active:scale-[0.98] shadow-sm"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={cancelEdit}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 font-semibold
                               hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSave}
                    className="rounded-2xl bg-indigo-600 px-4 py-2.5 font-semibold text-white
                               hover:bg-indigo-500 transition active:scale-[0.98] shadow-sm"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
            {/* Full Name */}
            <FieldCard title="Full Name" done={Boolean(profile.full_name?.trim())}>
              {!isEditing ? (
                <p className="mt-2 text-slate-700">{profile.full_name || "—"}</p>
              ) : (
                <input
                  value={fullNameText}
                  onChange={(e) => setFullNameText(e.target.value)}
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3
                 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              )}
            </FieldCard>

            {/* Fields */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Postal */}
              <FieldCard
                title="Postal code"
                done={Boolean(profile.postalCode?.trim())}
              >
                {!isEditing ? (
                  <p className="mt-2 text-slate-700">
                    {profile.postalCode || "—"}
                  </p>
                ) : (
                  <input
                    value={draft.postalCode}
                    onChange={(e) => updateDraft("postalCode", e.target.value)}
                    placeholder="e.g. K7L 0A1"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3
                               outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                )}
              </FieldCard>

              {/* Commitment */}
              <FieldCard
                title="Commitment hours"
                done={Boolean(profile.commitmentHours?.trim())}
              >
                {!isEditing ? (
                  <p className="mt-2 text-slate-700">
                    {profile.commitmentHours || "—"}
                  </p>
                ) : (
                  <select
                    value={draft.commitmentHours}
                    onChange={(e) =>
                      updateDraft("commitmentHours", e.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3
                               outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select…</option>
                    <option value="1 hr/week">1 hr/week</option>
                    <option value="2–4 hrs/week">2–4 hrs/week</option>
                    <option value="5–10 hrs/week">5–10 hrs/week</option>
                    <option value="10+ hrs/week">10+ hrs/week</option>
                    <option value="One-time / flexible">
                      One-time / flexible
                    </option>
                  </select>
                )}
              </FieldCard>

              {/* Skills */}
              <FieldCard title="Skills" done={(profile.skills || []).length > 0}>
                {!isEditing ? (
                  <TagList
                    items={profile.skills}
                    emptyText="Add skills (e.g. Cooking, Tutoring, Design)"
                  />
                ) : (
                  <>
                    <p className="mt-2 text-xs text-slate-500">
                      Comma-separated (e.g. Tutoring, First aid, Design)
                    </p>
                    <input
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      placeholder="Skills..."
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3
                                 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </>
                )}
              </FieldCard>

              {/* Interests */}
              <FieldCard
                title="Interests"
                done={(profile.interests || []).length > 0}
              >
                {!isEditing ? (
                  <TagList
                    items={profile.interests}
                    emptyText="Add interests (e.g. Youth, Environment, Community)"
                  />
                ) : (
                  <>
                    <p className="mt-2 text-xs text-slate-500">
                      Comma-separated (e.g. Youth, Environment, Community)
                    </p>
                    <input
                      value={interestsText}
                      onChange={(e) => setInterestsText(e.target.value)}
                      placeholder="Interests..."
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3
                                 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </>
                )}
              </FieldCard>
            </div>
          </div>

          {/* Sidebar: Opportunities */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold">Opportunities</h2>
            <p className="mt-2 text-slate-600">
              Browse volunteer roles and favorite the ones you like.
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

                <Link
                  to="/favourites"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 font-semibold
                             hover:bg-slate-50 transition"
                >
                  View favourites
                </Link>
              </div>
            </div>
          </div>

          {/* Completion bar */}
          {completion != 100 && (
            <div className="md:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    Profile completeness
                  </p>
                  {/* kept but unused in UI right now */}
                  {/* <p className="text-sm text-slate-600">{completionLabel}</p> */}
                </div>

                <div className="w-full sm:w-96">
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-indigo-600 transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4">
                    <MiniCheck
                      label="Postal"
                      ok={Boolean(profile.postalCode?.trim())}
                    />
                    <MiniCheck
                      label="Hours"
                      ok={Boolean(profile.commitmentHours?.trim())}
                    />
                    <MiniCheck label="Skills" ok={(profile.skills || []).length > 0} />
                    <MiniCheck
                      label="Interests"
                      ok={(profile.interests || []).length > 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* If no user */}
        {!user && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
            You’re not logged in.{" "}
            <Link
              className="font-semibold underline underline-offset-4"
              to="/signin"
            >
              Sign in
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}

function FieldCard({ title, done, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <span
          className={[
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            done
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-700",
          ].join(" ")}
        >
          {done ? "Done" : "Missing"}
        </span>
      </div>
      {children}
    </div>
  );
}

function TagList({ items, emptyText }) {
  if (!items || items.length === 0) {
    return <p className="mt-2 text-sm text-slate-500">{emptyText}</p>;
  }
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function MiniCheck({ label, ok }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold",
          ok
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-700",
        ].join(" ")}
      >
        {ok ? "✓" : "—"}
      </span>
      <span>{label}</span>
    </div>
  );
}