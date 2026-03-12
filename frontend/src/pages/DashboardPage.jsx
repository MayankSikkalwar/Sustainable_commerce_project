import { Activity, Box, Sparkles } from "lucide-react";

const stats = [
  {
    label: "Total Products in Catalog",
    value: "128",
    detail: "Structured, enriched, and ready for downstream search workflows.",
    icon: Box,
    accent: "text-cyan-300 bg-cyan-400/12 border-cyan-300/20",
  },
  {
    label: "Proposals Generated",
    value: "42",
    detail: "Recent B2B quotes assembled through the RAG proposal pipeline.",
    icon: Sparkles,
    accent: "text-fuchsia-300 bg-fuchsia-400/12 border-fuchsia-300/20",
  },
  {
    label: "API Health",
    value: "Online",
    detail: "Core admin services are reachable and ready for operator actions.",
    icon: Activity,
    accent: "text-emerald-300 bg-emerald-400/12 border-emerald-300/20",
  },
];

function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
          Command View
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">Welcome back, Admin</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
              Track the health of your sustainable commerce workflows and keep each module moving
              through the portal from a single overview screen.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-5 py-4 text-sm text-slate-300 backdrop-blur">
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
              className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_30px_100px_-40px_rgba(56,189,248,0.35)] backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
                </div>
                <div className={`rounded-2xl border p-3 ${stat.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-300">{stat.detail}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardPage;
