import { Link, Outlet, useLocation } from "react-router-dom";
import { Bell, CircleUserRound, ClipboardPlus, Headset, LayoutDashboard, Sparkles, Store } from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Add Product",
    to: "/products/new",
    icon: ClipboardPlus,
  },
  {
    label: "B2B Proposals",
    to: "/proposals",
    icon: Sparkles,
  },
  {
    label: "Support",
    to: "/support",
    icon: Headset,
  },
];

/**
 * Shared admin shell used by all portal pages.
 *
 * Architectural purpose:
 * - Layout components hold repeated chrome such as sidebars, headers, and page
 *   framing so individual pages only care about page-specific content.
 * - This avoids copying the same navigation markup into every route component.
 * - In a scalable admin portal, shared layout boundaries are a key part of
 *   separation of concerns: layout owns navigation, pages own workflows, and
 *   components own reusable UI fragments.
 */
function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.08),_transparent_22%),linear-gradient(180deg,_#09090b_0%,_#0a0a0a_100%)] text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-900/95 backdrop-blur print:hidden xl:flex xl:flex-col">
          <div className="border-b border-zinc-800 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Admin Portal</p>
                <h1 className="text-lg font-semibold text-white">Rayeva AI Systems</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 rounded-r-2xl border-l-2 px-4 py-3 text-sm transition ${
                        isActive
                          ? "border-emerald-500 bg-gradient-to-r from-emerald-500/10 to-transparent text-white"
                          : "border-transparent text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-emerald-300" : "text-zinc-500"}`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur print:hidden">
            <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Sustainable Commerce SaaS</p>
                <h2 className="text-2xl font-semibold text-white">Operations Console</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-emerald-500/30 hover:text-white"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900 py-2 pl-2 pr-4">
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-200">
                    <CircleUserRound className="h-5 w-5" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">Admin</p>
                    <p className="text-xs text-zinc-500">Workspace Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8 print:px-0 print:py-0 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
