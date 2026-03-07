import {
  BadgeDollarSign,
  BrainCircuit,
  FileStack,
  LoaderCircle,
  Save,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import apiClient from "../api/apiClient";

/**
 * B2B proposal generation screen.
 *
 * This page coordinates the proposal workflow:
 * - collect client context,
 * - trigger the backend RAG pipeline,
 * - render the structured quote result,
 * - persist the proposal after review.
 *
 * The actual vector retrieval and LLM generation stay in the backend, which is
 * important for security, maintainability, and interview-friendly separation of
 * concerns.
 */
function ProposalGeneratorPage() {
  const [clientName, setClientName] = useState("");
  const [clientNeeds, setClientNeeds] = useState("");
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [proposalData, setProposalData] = useState(null);

  async function handleGenerateProposal() {
    if (!clientName.trim() || !clientNeeds.trim() || !budget) {
      window.alert("Please provide the client name, needs, and budget.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiClient.post("/proposals/generate", {
        clientName,
        clientNeeds,
        budget: Number(budget),
      });

      setProposalData(response);
    } catch (error) {
      window.alert(error.message || "Proposal generation failed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveProposal() {
    if (!proposalData?.proposal) {
      window.alert("Generate a proposal before saving.");
      return;
    }

    try {
      setIsSaving(true);

      await apiClient.post("/proposals/save", {
        clientName,
        budget: Number(budget),
        proposal: proposalData.proposal,
      });

      setClientName("");
      setClientNeeds("");
      setBudget("");
      setProposalData(null);
      window.alert("Proposal saved successfully.");
    } catch (error) {
      window.alert(error.message || "Saving proposal failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="inline-flex rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-fuchsia-200">
            Module 2
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white">
            Generate budget-aware B2B proposals using vector search and RAG.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300">
            This workflow embeds the client requirement, retrieves the closest product vectors from
            MongoDB, and asks Groq to turn those top matches into a structured eco-commerce quote.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_30px_100px_-40px_rgba(217,70,239,0.45)] backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-fuchsia-400/12 p-3 text-fuchsia-300">
              <FileStack className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Proposal Brief</h2>
              <p className="text-sm text-slate-400">
                Capture the client context and let the backend assemble a grounded quote.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Client name</span>
              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Example: GreenNest Corporate Gifts"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/20"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Client needs</span>
              <textarea
                value={clientNeeds}
                onChange={(event) => setClientNeeds(event.target.value)}
                rows={7}
                placeholder="Describe the use case, target audience, sustainability goal, and commercial constraints."
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/20"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Budget</span>
              <div className="relative">
                <BadgeDollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fuchsia-300" />
                <input
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  placeholder="5000"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-12 py-3 text-slate-100 outline-none transition focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/20"
                />
              </div>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerateProposal}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-fuchsia-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{isLoading ? "Generating..." : "Generate Smart Proposal 🚀"}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveProposal}
              disabled={isSaving || !proposalData?.proposal}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300/25 bg-emerald-400/12 px-5 py-3 font-medium text-emerald-200 transition hover:bg-emerald-400/18 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isSaving ? "Saving..." : "Save Proposal"}</span>
            </button>
          </div>
        </div>

        {proposalData?.matchedProducts?.length ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
              <BrainCircuit className="h-4 w-4 text-fuchsia-300" />
              Top Vector Matches
            </div>
            <div className="space-y-3">
              {proposalData.matchedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-900/70 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-slate-400">
                      Cost ${product.cost.toFixed(2)} • Price ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">
                    similarity {product.similarityScore?.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/80">Proposal Output</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Invoice / Quote Preview</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-xs font-medium text-fuchsia-100">
            <BrainCircuit className="h-3.5 w-3.5" />
            Powered by Vector Search & RAG 🧠
          </span>
        </div>

        {proposalData?.proposal ? (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Client</p>
                <p className="mt-2 text-lg font-semibold text-white">{clientName}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Budget</p>
                <p className="mt-2 text-lg font-semibold text-white">${Number(budget).toFixed(2)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/80">Estimated Total</p>
                <p className="mt-2 text-lg font-semibold text-emerald-100">
                  ${Number(proposalData.proposal.totalEstimatedCost || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-left">
                <thead className="bg-slate-900/90">
                  <tr className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Unit Cost</th>
                    <th className="px-5 py-4">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8 bg-slate-950/40">
                  {(proposalData.proposal.productsMix || []).map((item) => (
                    <tr key={`${item.productName}-${item.suggestedQuantity}`} className="text-slate-200">
                      <td className="px-5 py-4 font-medium text-white">{item.productName}</td>
                      <td className="px-5 py-4">{item.suggestedQuantity}</td>
                      <td className="px-5 py-4">${Number(item.unitCost || 0).toFixed(2)}</td>
                      <td className="px-5 py-4">${Number(item.totalLineCost || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-3xl border border-fuchsia-300/15 bg-fuchsia-400/8 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-200/80">Impact Positioning</p>
              <p className="mt-3 text-base leading-8 text-slate-100">
                {proposalData.proposal.impactPositioningSummary}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-10 text-center text-slate-400">
            Generate a proposal to see the quote table, impact summary, and retrieved product mix.
          </div>
        )}
      </div>
    </section>
  );
}

export default ProposalGeneratorPage;
