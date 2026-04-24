"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const avatars = [
  { id: "calm-listener", icon: "CL", label: "Calm Listener" },
  { id: "reflective-lead", icon: "RL", label: "Reflective Lead" },
  { id: "steady-friend", icon: "SF", label: "Steady Friend" },
  { id: "curious-observer", icon: "CO", label: "Curious Observer" }
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const residenceOptions = ["Urban", "Rural"];
const educationOptions = ["Undergraduate", "Postgraduate", "Diploma", "Higher secondary", "Other"];
const institutionOptions = ["Government", "Private", "Aided", "Autonomous", "Other"];
const sesOptions = ["Lower", "Lower middle", "Middle", "Upper middle", "Upper", "Prefer not to say"];

function makeUserId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getAgeGroup(age) {
  if (age <= 21) return "18-21";
  if (age <= 24) return "22-24";
  return "25-27";
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-purple-100">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-pink-300/70 focus:ring-4 focus:ring-pink-500/10";

const selectClass =
  "w-full rounded-2xl border border-white/12 bg-[#0b0a14] px-4 py-3 text-sm text-white outline-none transition focus:border-pink-300/70 focus:ring-4 focus:ring-pink-500/10";

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    participantName: "",
    ageYears: "",
    gender: "",
    residenceArea: "",
    educationLevel: "",
    institutionType: "",
    socioeconomicStatus: "",
    primaryLanguage: "",
    city: "",
    state: "",
    country: "India",
    additionalNotes: ""
  });
  const [avatarId, setAvatarId] = useState(avatars[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedAvatar = useMemo(
    () => avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0],
    [avatarId]
  );

  const ageNumber = Number(form.ageYears);
  const canStart =
    form.participantName.trim().length > 1 &&
    Number.isInteger(ageNumber) &&
    ageNumber >= 18 &&
    ageNumber <= 27 &&
    form.gender &&
    form.residenceArea &&
    !loading;

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function cleanOptional(value) {
    const trimmed = String(value ?? "").trim();
    return trimmed ? trimmed : undefined;
  }

  async function beginJourney() {
    if (!canStart) {
      setError("Please enter name, age between 18 and 27, gender, and residence area.");
      return;
    }

    setLoading(true);
    setError("");

    const anonymousUserId = sessionStorage.getItem("anonymousUserId") || makeUserId();
    const demographics = {
      participantName: form.participantName.trim(),
      ageYears: ageNumber,
      gender: form.gender,
      residenceArea: form.residenceArea,
      educationLevel: cleanOptional(form.educationLevel),
      institutionType: cleanOptional(form.institutionType),
      socioeconomicStatus: cleanOptional(form.socioeconomicStatus),
      primaryLanguage: cleanOptional(form.primaryLanguage),
      city: cleanOptional(form.city),
      state: cleanOptional(form.state),
      country: cleanOptional(form.country),
      additionalNotes: cleanOptional(form.additionalNotes)
    };

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousUserId,
          ageGroup: getAgeGroup(ageNumber),
          avatarId,
          demographics
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not start session");

      sessionStorage.setItem("anonymousUserId", data.anonymousUserId);
      sessionStorage.setItem("userId", data.anonymousUserId);
      sessionStorage.setItem("sessionId", data.sessionId);
      sessionStorage.setItem("scenarioOrder", JSON.stringify(data.scenarioOrder ?? []));
      sessionStorage.setItem("playerName", form.participantName.trim());
      sessionStorage.setItem("playerAvatar", selectedAvatar.label);
      localStorage.setItem("ei.assessment.anonymousUserId", data.anonymousUserId);
      localStorage.setItem("ei.assessment.sessionId", data.sessionId);
      localStorage.setItem("ei.assessment.scenarioOrder", JSON.stringify(data.scenarioOrder ?? []));
      router.push(`/assessment/${data.scenarioOrder?.[0] ?? "level-01"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start session");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070712] px-4 py-6 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(168,85,247,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.16),transparent_30%),linear-gradient(135deg,#070712,#151026_55%,#08070d)]" />
      <div className="film-grain absolute inset-0" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6 backdrop-blur md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-pink-200">Participant setup</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            Start your EI story profile.
          </h1>
          <p className="mt-5 text-base leading-7 text-purple-100/75">
            These socio-demographic details help organize the research data. Your story choices remain tied to an anonymous session ID.
          </p>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-sm leading-6 text-white/70">
            Required: name, age, gender, and residence area. Other fields are useful for analysis and can be skipped if unavailable.
          </div>
        </div>

        <div className="max-h-none rounded-[2rem] border border-white/10 bg-white/[0.075] p-5 shadow-2xl backdrop-blur md:p-7 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                value={form.participantName}
                onChange={(event) => updateField("participantName", event.target.value)}
                placeholder="Participant name"
                autoFocus
              />
            </Field>

            <Field label="Age">
              <input
                className={inputClass}
                type="number"
                min="18"
                max="27"
                value={form.ageYears}
                onChange={(event) => updateField("ageYears", event.target.value)}
                placeholder="18-27"
              />
            </Field>

            <Field label="Gender">
              <select className={selectClass} value={form.gender} onChange={(event) => updateField("gender", event.target.value)}>
                <option value="">Select gender</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Residence area">
              <select
                className={selectClass}
                value={form.residenceArea}
                onChange={(event) => updateField("residenceArea", event.target.value)}
              >
                <option value="">Select area</option>
                {residenceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Education level">
              <select
                className={selectClass}
                value={form.educationLevel}
                onChange={(event) => updateField("educationLevel", event.target.value)}
              >
                <option value="">Select education</option>
                {educationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Institution type">
              <select
                className={selectClass}
                value={form.institutionType}
                onChange={(event) => updateField("institutionType", event.target.value)}
              >
                <option value="">Select institution</option>
                {institutionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Socioeconomic status">
              <select
                className={selectClass}
                value={form.socioeconomicStatus}
                onChange={(event) => updateField("socioeconomicStatus", event.target.value)}
              >
                <option value="">Select status</option>
                {sesOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Primary language">
              <input
                className={inputClass}
                value={form.primaryLanguage}
                onChange={(event) => updateField("primaryLanguage", event.target.value)}
                placeholder="Malayalam, English, Hindi..."
              />
            </Field>

            <Field label="City">
              <input className={inputClass} value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="City" />
            </Field>

            <Field label="State">
              <input className={inputClass} value={form.state} onChange={(event) => updateField("state", event.target.value)} placeholder="State" />
            </Field>

            <Field label="Country">
              <input
                className={inputClass}
                value={form.country}
                onChange={(event) => updateField("country", event.target.value)}
                placeholder="Country"
              />
            </Field>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-purple-100">Avatar</p>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {avatars.map((avatar) => (
                <button
                  type="button"
                  key={avatar.id}
                  onClick={() => setAvatarId(avatar.id)}
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    avatarId === avatar.id
                      ? "border-pink-300/70 bg-pink-500/15 shadow-[0_16px_50px_rgba(236,72,153,0.15)]"
                      : "border-white/10 bg-black/25 hover:border-white/25 hover:bg-white/[0.08]"
                  ].join(" ")}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xs font-black text-slate-950">
                    {avatar.icon}
                  </span>
                  <span className="mt-3 block text-sm font-bold text-white">{avatar.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Field label="Additional notes">
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={form.additionalNotes}
                onChange={(event) => updateField("additionalNotes", event.target.value)}
                placeholder="Optional research notes"
              />
            </Field>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={beginJourney}
            disabled={!canStart}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-4 text-base font-black text-white shadow-[0_16px_60px_rgba(168,85,247,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? "Creating research session..." : "Start Journey"}
          </button>
        </div>
      </section>
    </main>
  );
}
