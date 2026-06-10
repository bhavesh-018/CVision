import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <FileText size={20} />
          </div>

          <div>
            <h1 className="font-bold">
              AI Resume Analyzer
            </h1>

            <p className="text-xs text-slate-400">
              Career Intelligence Platform
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <Link to="/" className="hover:text-white">
            Home
          </Link>

          <Link to="/dashboard" className="hover:text-white">
            Dashboard
          </Link>

          <Link to="/chat" className="hover:text-white text-emerald-400 font-medium">
            Resume Chat
          </Link>
        </nav>

        <button className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm hover:border-blue-500">
          GitHub
        </button>

      </div>
    </header>
  );
}

export default Navbar;