import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" className="h-35 object-contain w-auto mt-2" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <Link to="/" className="hover:text-white">
            Home
          </Link>

          <Link to="/dashboard" className="hover:text-white">
            Dashboard
          </Link>

          <Link to="/chat" className="hover:text-white">
            Resume Chat
          </Link>

          <Link to="/github" className="hover:text-white">
            GitHub
          </Link>

          <Link to="/jobs" className="hover:text-white">
            Jobs
          </Link>

          <Link to="/linkedin" className="hover:text-white">
            LinkedIn
          </Link>

          <Link to="/coach" className="hover:text-white text-blue-400 font-medium">
            Career Coach
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;