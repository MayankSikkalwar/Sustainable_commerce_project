/**
 * Placeholder page for the future product enrichment workflow.
 *
 * Page-level separation of concerns:
 * - Pages represent route-level business workflows.
 * - They coordinate layout, feature components, and API calls without owning
 *   global navigation or low-level HTTP setup.
 * - This boundary is especially useful in interviews because it shows a clear
 *   distinction between reusable UI, route screens, and infrastructure modules.
 */
function ProductOnboardingPage() {
  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-4">
        <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
          Module 1 Prep
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Product onboarding workspace is ready for AI enrichment.
        </h1>
        <p className="text-lg leading-8 text-slate-300">
          This route is the placeholder for the Phase 3 product enrichment flow.
          The admin shell, route boundary, and API layer are now in place so the
          next module can plug into a clean structure instead of a prototype UI.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <p className="text-sm font-medium text-white">Frontend Route Layer</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            React Router now defines the product onboarding screen as a page under
            a shared admin layout.
          </p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <p className="text-sm font-medium text-white">Backend MVC Layer</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Product routes and controllers are scaffolded so Module 1 can add
            endpoints without bloating the Express app entrypoint.
          </p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <p className="text-sm font-medium text-white">Integration Layer</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            A centralized API client is ready to host future product enrichment
            calls to the backend.
          </p>
        </article>
      </div>
    </section>
  );
}

export default ProductOnboardingPage;
