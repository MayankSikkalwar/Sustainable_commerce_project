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

function formatINR(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

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
 *
 * Print/PDF note:
 * - This screen uses native CSS print styles plus `window.print()` instead of a
 *   heavyweight PDF generation library.
 * - That approach is often a strong pragmatic choice for admin portals because
 *   browser print engines already know how to paginate tables and text content.
 * - It keeps the feature dependency-free while still producing a professional
 *   export for quotes and proposal handoffs.
 */
function ProposalGeneratorPage() {
  const [clientName, setClientName] = useState("");
  const [clientNeeds, setClientNeeds] = useState("");
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [proposalData, setProposalData] = useState(null);

  function handleDownloadPdf() {
    window.print();
  }

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
    <section className="grid gap-8 print:block xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-8 print:hidden">
        <div className="space-y-4">
          <p className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
            Module 2
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white">
            Generate budget-aware B2B proposals using vector search and RAG.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-400">
            This workflow embeds the client requirement, retrieves the closest product vectors from
            MongoDB, and asks Groq to turn those top matches into a structured eco-commerce quote.
          </p>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 shadow-[0_25px_80px_-45px_rgba(0,0,0,0.85)] backdrop-blur print:hidden">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3 text-sky-300">
              <FileStack className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Proposal Brief</h2>
              <p className="text-sm text-zinc-500">
                Capture the client context and let the backend assemble a grounded quote.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-200">Client name</span>
              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Example: GreenNest Corporate Gifts"
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-200">Client needs</span>
              <textarea
                value={clientNeeds}
                onChange={(event) => setClientNeeds(event.target.value)}
                rows={7}
                placeholder="Describe the use case, target audience, sustainability goal, and commercial constraints."
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-200">Budget (₹)</span>
              <div className="relative">
                <BadgeDollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  placeholder="5000"
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-12 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerateProposal}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{isLoading ? "Generating..." : "Generate Smart Proposal 🚀"}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveProposal}
              disabled={isSaving || !proposalData?.proposal}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-medium text-emerald-200 transition hover:border-emerald-500/30 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isSaving ? "Saving..." : "Save Proposal"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={!proposalData?.proposal}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-medium text-zinc-100 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileStack className="h-4 w-4" />
              <span>Download as PDF 📄</span>
            </button>
          </div>
        </div>

        {proposalData?.matchedProducts?.length ? (
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 backdrop-blur print:hidden">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-200">
              <BrainCircuit className="h-4 w-4 text-sky-300" />
              Top Vector Matches
            </div>
            <div className="space-y-3">
              {proposalData.matchedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-zinc-500">
                      Cost {formatINR(product.cost)} • Price {formatINR(product.price)}
                    </p>
                  </div>
                  <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-100">
                    similarity {product.similarityScore?.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 backdrop-blur print:rounded-none print:border-0 print:bg-white print:p-0 print:text-black print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4 print:border-b print:border-slate-300 print:pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 print:text-slate-500">Proposal Output</p>
            <h2 className="mt-2 text-3xl font-semibold text-white print:text-black">Invoice / Quote Preview</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-xs font-medium text-sky-100 print:border-slate-300 print:bg-white print:text-black">
            <BrainCircuit className="h-3.5 w-3.5" />
            Powered by Vector Search & RAG 🧠
          </span>
        </div>

        {proposalData?.proposal ? (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 print:border-slate-300 print:bg-white">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 print:text-slate-500">Client</p>
                <p className="mt-2 text-lg font-semibold text-white print:text-black">{clientName}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 print:border-slate-300 print:bg-white">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 print:text-slate-500">Budget</p>
                <p className="mt-2 text-lg font-semibold text-white print:text-black">{formatINR(budget)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 print:border-slate-300 print:bg-white">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/80 print:text-slate-500">Estimated Total</p>
                <p className="mt-2 text-lg font-semibold text-emerald-100 print:text-black">
                  {formatINR(proposalData.proposal.totalEstimatedCost || 0)}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-zinc-800 print:rounded-none print:border-slate-300">
              <table className="min-w-full divide-y divide-zinc-800 text-left print:divide-slate-300">
                <thead className="bg-zinc-950 print:bg-white">
                  <tr className="text-xs uppercase tracking-[0.18em] text-zinc-500 print:text-slate-600">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Unit Cost</th>
                    <th className="px-5 py-4">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900/40 print:divide-slate-200 print:bg-white">
                  {(proposalData.proposal.productsMix || []).map((item) => (
                    <tr
                      key={`${item.productName}-${item.suggestedQuantity}`}
                      className="text-zinc-200 print:text-black"
                    >
                      <td className="px-5 py-4 font-medium text-white print:text-black">{item.productName}</td>
                      <td className="px-5 py-4">{item.suggestedQuantity}</td>
                      <td className="px-5 py-4">{formatINR(item.unitCost || 0)}</td>
                      <td className="px-5 py-4">{formatINR(item.totalLineCost || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 print:border-slate-300 print:bg-white">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 print:text-slate-500">Impact Positioning</p>
              <p className="mt-3 text-base leading-8 text-zinc-100 print:text-black">
                {proposalData.proposal.impactPositioningSummary}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/70 p-10 text-center text-zinc-500">
            Generate a proposal to see the quote table, impact summary, and retrieved product mix.
          </div>
        )}
      </div>
    </section>
  );
}

export default ProposalGeneratorPage;
