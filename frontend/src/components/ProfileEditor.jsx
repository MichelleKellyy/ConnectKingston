// src/components/ProfileEditor.js
import React from "react";
import FieldCard from "./FieldCard";
import TagList from "./TagList";

export default function ProfileEditor({
    profile,
    draft,
    isEditing,
    fullNameText,
    skillsText,
    interestsText,
    updateDraft,
    setFullNameText,
    setSkillsText,
    setInterestsText,
    startEdit,
    cancelEdit,
    onSave,
}) {
    return (
        <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">Your profile</h2>
                    <p className="mt-2 text-slate-600">Fill these out to get better matches.</p>
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

            {/* Other Fields */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Postal */}
                <FieldCard title="Postal code" done={Boolean(profile.postalCode?.trim())}>
                    {!isEditing ? (
                        <p className="mt-2 text-slate-700">{profile.postalCode || "—"}</p>
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

                {/* Commitment hours */}
                <FieldCard title="Commitment hours" done={Boolean(profile.commitmentHours?.trim())}>
                    {!isEditing ? (
                        <p className="mt-2 text-slate-700">{profile.commitmentHours || "—"}</p>
                    ) : (
                        <select
                            value={draft.commitmentHours}
                            onChange={(e) => updateDraft("commitmentHours", e.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3
                         outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">Select…</option>
                            <option value="1 hr/week">1 hr/week</option>
                            <option value="2–4 hrs/week">2–4 hrs/week</option>
                            <option value="5–10 hrs/week">5–10 hrs/week</option>
                            <option value="10+ hrs/week">10+ hrs/week</option>
                            <option value="One-time / flexible">One-time / flexible</option>
                        </select>
                    )}
                </FieldCard>

                {/* Skills */}
                <FieldCard title="Skills" done={(profile.skills || []).length > 0}>
                    {!isEditing ? (
                        <TagList items={profile.skills} emptyText="Add skills (e.g. Cooking, Tutoring, Design)" />
                    ) : (
                        <>
                            <p className="mt-2 text-xs text-slate-500">Comma-separated (e.g. Tutoring, First aid, Design)</p>
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
                <FieldCard title="Interests" done={(profile.interests || []).length > 0}>
                    {!isEditing ? (
                        <TagList items={profile.interests} emptyText="Add interests (e.g. Youth, Environment, Community)" />
                    ) : (
                        <>
                            <p className="mt-2 text-xs text-slate-500">Comma-separated (e.g. Youth, Environment, Community)</p>
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
    );
}
