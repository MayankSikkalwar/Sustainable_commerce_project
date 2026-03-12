import { Activity, Box, Sparkles } from "lucide-react";

const stats = [
  {
    label: "Total Products in Catalog",
    value: "128",
    detail: "Structured, enriched, and ready for downstream search workflows.",
    icon: Box,
    accent: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    glow: "from-emerald-500/18 via-emerald-500/6 to-transparent",
  },
  {
    label: "Proposals Generated",
    value: "42",
    detail: "Recent B2B quotes assembled through the RAG proposal pipeline.",
    icon: Sparkles,
    accent: "text-sky-300 bg-sky-500/10 border-sky-500/20",
    glow: "from-sky-500/18 via-sky-500/6 to-transparent",
  },
  {
    label: "API Health",
    value: "Online",
    detail: "Core admin services are reachable and ready for operator actions.",
    icon: Activity,
    accent: "text-teal-300 bg-teal-500/10 border-teal-500/20",
    glow: "from-teal-500/18 via-teal-500/6 to-transparent",
  },
];

function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
          Command View
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">Welcome back, Admin</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-400">
              Track the health of your sustainable commerce workflows and keep each module moving
              through the portal from a single overview screen.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 px-5 py-4 text-sm text-zinc-400 backdrop-blur">
            Today&apos;s focus: catalog quality, proposal throughput, and support readiness.
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="group relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 shadow-[0_25px_80px_-45px_rgba(0,0,0,0.85)] backdrop-blur"
            >
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${stat.glow} blur-2xl`} />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_38%)]" />
              <div className="flex items-start justify-between gap-4">
                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
                </div>
                <div className={`relative z-10 rounded-2xl border p-3 shadow-lg ${stat.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="relative z-10 mt-6 text-sm leading-6 text-zinc-300">{stat.detail}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardPage;
