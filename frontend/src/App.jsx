const setupChecklist = [
  "Backend folder created with Express, CORS, dotenv, Prisma, Hugging Face, and Groq dependencies.",
  "MongoDB Prisma schema added for Product, Proposal, Order, and AILog collections.",
  "Seed script prepared with four sustainable products and empty embedding arrays.",
  "Frontend converted to React + Vite and wired to Tailwind CSS v4.2 through the official Vite plugin.",
];

function App() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-6 py-16">
        <div className="max-w-3xl space-y-6">
          <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm tracking-[0.2em] text-emerald-200 uppercase">
            Phase 1 Workspace
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Sustainable commerce stack bootstrapped for AI + ML modules.
          </h1>
          <p className="text-lg leading-8 text-stone-300">
            This starter frontend is intentionally simple. It exists to confirm
            the React, Vite, and Tailwind v4 pipeline is working before the
            product onboarding and proposal generation screens are built in the
            next phases.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {setupChecklist.map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6 shadow-[0_20px_80px_-40px_rgba(16,185,129,0.45)]"
            >
              <p className="text-sm leading-7 text-stone-200">{item}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
