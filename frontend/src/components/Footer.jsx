import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/60">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-slate-100">ConnectKingston</p>
            <p className="mt-1 text-sm text-slate-400">
              Built for a hackathon • Helping communities connect
            </p>
          </div>

          <div className="flex gap-4 text-sm text-slate-300">
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>
            <Link to="/signin" className="hover:text-white">
              Sign in
            </Link>
            <Link to="/signup" className="hover:text-white">
              Get started
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          © {new Date().getFullYear()} ConnectKingston. All rights reserved.
        </p>
      </div>
    </footer>
  );
}