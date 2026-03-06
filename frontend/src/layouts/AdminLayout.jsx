import { Link, Outlet, useLocation } from "react-router-dom";
import { ClipboardPlus, Headset, LayoutDashboard, Sparkles, Store } from "lucide-react";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,_#0f172a_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/60 backdrop-blur xl:flex xl:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Admin Portal</p>
                <h1 className="text-lg font-semibold text-white">Rayeva AI Systems</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                        isActive
                          ? "bg-cyan-400/15 text-white shadow-[0_18px_50px_-28px_rgba(34,211,238,0.85)]"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="m-4 rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Phase Focus</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Product enrichment, vector search, and proposal generation will plug
              into this shell as separate workflow pages.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-white/10 bg-slate-950/35 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Sustainable Commerce SaaS</p>
                <h2 className="text-2xl font-semibold text-white">Operations Console</h2>
              </div>
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                Backend API: {`http://localhost:5000/api`}
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
