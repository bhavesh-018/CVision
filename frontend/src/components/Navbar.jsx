import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { MoreVertical, X, Home, LayoutDashboard, MessageSquareText, GitFork, Briefcase, Globe, Brain } from "lucide-react";

const NAV_LINKS = [
  { to: "/",          label: "Home",         icon: Home },
  { to: "/dashboard", label: "Dashboard",    icon: LayoutDashboard },
  { to: "/chat",      label: "Resume Chat",  icon: MessageSquareText },
  { to: "/github",    label: "GitHub",       icon: GitFork },
  { to: "/jobs",      label: "Jobs",         icon: Briefcase },
  { to: "/linkedin",  label: "LinkedIn",     icon: Globe },
  { to: "/coach",     label: "Career Coach", icon: Brain, highlight: true },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY — covers background when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-slate-950/80 backdrop-blur-md md:hidden animate-fadeIn"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">

          {/* LOGO — always left */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="CVision"
              style={{
                height: "44px",
                width: "160px",
                objectFit: "cover",
                objectPosition: "22% center",
                marginTop: "1px",
              }}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`transition-colors hover:text-white ${
                    isActive ? "text-white font-semibold" : ""
                  } ${link.highlight && !isActive ? "text-blue-400 font-medium" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* MOBILE — ⋮ button + dropdown */}
          <div className="md:hidden relative z-50" ref={menuRef}>
            <button
              id="mobile-nav-toggle"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`flex items-center justify-center h-9 w-9 rounded-xl transition-colors ${
                menuOpen
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
              aria-label="Open navigation menu"
            >
              {menuOpen ? <X size={18} /> : <MoreVertical size={18} />}
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="absolute right-0 top-12 w-60 rounded-2xl border border-slate-700/80 bg-slate-900/98 backdrop-blur-2xl shadow-2xl shadow-black/80 py-2 animate-fadeIn z-50">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.to;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600/20 text-blue-300 border-l-2 border-blue-500 pl-[14px]"
                          : link.highlight
                          ? "text-blue-400 hover:bg-slate-800 hover:text-blue-300"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-blue-400" : "text-slate-400"} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
}

export default Navbar;