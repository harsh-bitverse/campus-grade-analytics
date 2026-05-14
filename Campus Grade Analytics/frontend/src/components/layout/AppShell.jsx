import { NavLink, Outlet } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/submit", label: "Submit Marks" }
];

export default function AppShell() {
  const [theme, setTheme] = useState("dark");
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-brand-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Campus Grade Analytics</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Crowdsourced relative grading insights</p>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-brand-600" : "text-slate-600 dark:text-slate-300"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin ? <NavLink to="/admin" className="text-sm font-medium text-slate-600 dark:text-slate-300">Admin</NavLink> : null}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              className="rounded-full border border-slate-200 p-2 dark:border-slate-800"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-brand-500"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-brand-500">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

