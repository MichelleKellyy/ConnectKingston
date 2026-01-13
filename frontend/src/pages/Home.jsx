import { Link } from "react-router-dom";
import bg from "../assets/img1.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO with BIG background image */}
      <section className="relative">
        {/* Background image */}
        <div
          className="h-[600px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 h-[600px] bg-black/50" />

        {/* Hero content */}
        <div className="absolute inset-0 h-[600px]">
          <div className="mx-auto flex h-full max-w-4xl flex-col justify-center px-4 text-center">
            {/* Small label pill */}
            <p className="mx-auto inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
              Connect • Volunteer • Build community
            </p>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              ConnectKingston
            </h1>

            <p className="mt-4 text-lg text-white/90">
              A simple way to find local volunteer opportunities that match your time,
              interests, and skills.
            </p>

            {/* CTA */}
            <div className="mt-10 flex items-center justify-center">
              <Link
                to="/signup"
                className="rounded-2xl bg-indigo-600 px-7 py-3 font-semibold text-white
                           hover:bg-indigo-500 transition active:scale-[0.98] shadow-sm"
              >
                Get started
              </Link>
            </div>

            {/* Sign in */}
            <p className="mt-4 text-sm text-white/90">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold underline underline-offset-4 hover:text-white"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Steps section (prettier) */}
<section className="relative">
  {/* soft background gradient behind the section */}
  <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />

  <div className="relative mx-auto max-w-6xl px-4 py-16">
    {/* Section heading */}
    <div className="mb-10 text-center">
      <p className="mx-auto inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
        How it works
      </p>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        Getting started is easy
      </h2>
      <p className="mt-2 text-slate-600">
        Three quick steps to start helping your community.
      </p>
    </div>

    {/* Cards */}
    <div className="grid gap-5 md:grid-cols-3">
      <PrettyStepCard
        step="1"
        icon="📝"
        title="Create profile"
        body="Set your skills, interests, location, and time commitment."
      />
      <PrettyStepCard
        step="2"
        icon="🔎"
        title="Find opportunities"
        body="Browse relevant causes that match your profile and schedule."
      />
      <PrettyStepCard
        step="3"
        icon="🤝"
        title="Get involved"
        body="Volunteer, connect with organizations, and make an impact."
      />
    </div>

    {/* Mini CTA bar (makes it feel finished) */}
    <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Ready to make a difference?
        </h3>
        <p className="mt-1 text-slate-600">
          Create an account and get matched in under a minute.
        </p>
      </div>

      <Link
        to="/signup"
        className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white
                   hover:bg-indigo-500 transition active:scale-[0.98] shadow-sm"
      >
        Get started
      </Link>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
          © {new Date().getFullYear()} Connect Kingston
        </div>
      </footer>
    </div>
  );
}

function PrettyStepCard({ step, icon, title, body }) {
  return (
    <div
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm
                 transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* top row: icon + step badge */}
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
          {icon}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
          Step {step}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{body}</p>

      {/* tiny decorative line */}
      <div className="mt-5 h-1 w-16 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition" />
    </div>
  );
}