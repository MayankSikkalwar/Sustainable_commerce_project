import { Bot, MessageSquareQuote } from "lucide-react";

function SupportPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
          Support Operations
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Customer Support Center</h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-400">
          This area is reserved for conversational support tooling and AI-assisted service flows.
        </p>
      </div>

      <div className="max-w-4xl rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 shadow-[0_25px_80px_-45px_rgba(0,0,0,0.85)] backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-100">
              <MessageSquareQuote className="h-4 w-4" />
              Coming Soon
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Module 4 support architecture</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">
                Module 4: AI WhatsApp Support Bot is currently in architectural design. This
                module will feature Hugging Face sentiment analysis and Twilio integration.
              </p>
            </div>
          </div>

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-200">
            <Bot className="h-9 w-9" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportPage;
