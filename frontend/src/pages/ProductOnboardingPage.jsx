import { LoaderCircle, Save, Sparkles, Tag, Leaf, Boxes, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import apiClient from "../api/apiClient";

/**
 * Product onboarding screen for Module 1.
 *
 * Separation-of-concerns reminder:
 * - This page owns workflow state such as form fields, loading flags, and the
 *   currently enriched AI result.
 * - It does not contain low-level networking details because that logic is
 *   delegated to `apiClient`.
 * - It does not contain backend AI logic because those concerns live in the
 *   Express controllers and service modules.
 *
 * That boundary makes the page easier to reason about: the page coordinates the
 * user journey, while the backend performs the actual AI/ML work.
 */
function ProductOnboardingPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [enrichedData, setEnrichedData] = useState(null);

  const embeddingExists = Array.isArray(enrichedData?.mlEmbedding) && enrichedData.mlEmbedding.length > 0;

  async function handleEnrich() {
    if (!name.trim() || !description.trim() || !price || !cost) {
      window.alert("Please enter name, description, unit price, and unit cost before running AI enrichment.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiClient.post("/products/enrich", {
        name,
        description,
        price: Number(price),
        cost: Number(cost),
      });

      setEnrichedData(response);
    } catch (error) {
      window.alert(error.message || "AI enrichment failed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!enrichedData?.aiData) {
      window.alert("Generate AI suggestions before saving.");
      return;
    }

    try {
      setIsSaving(true);

      await apiClient.post("/products/save", {
        name,
        description,
        price: Number(price),
        cost: Number(cost),
        primaryCategory: enrichedData.aiData.primaryCategory,
        subCategory: enrichedData.aiData.subCategory,
        seoTags: enrichedData.aiData.seoTags,
        sustainabilityFilters: enrichedData.aiData.sustainabilityFilters,
        embedding: enrichedData.mlEmbedding,
      });

      setName("");
      setDescription("");
      setPrice("");
      setCost("");
      setEnrichedData(null);
      window.alert("Product saved successfully.");
    } catch (error) {
      window.alert(error.message || "Saving product failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
            Module 1
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white">
            Auto-categorize products, generate SEO tags, and create ML vectors in one workflow.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-400">
            This screen sends a product draft to Groq for structured catalog suggestions and to
            Hugging Face for vector embedding generation, then lets the admin review and persist
            the result to MongoDB.
          </p>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 shadow-[0_25px_80px_-45px_rgba(0,0,0,0.85)] backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-300">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Product Draft</h2>
              <p className="text-sm text-zinc-500">Describe the item and let the AI prepare catalog metadata.</p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-200">Product name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: OceanLoop Stainless Steel Straw Set"
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-200">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={7}
                placeholder="Describe the material, use case, sustainability angle, and target buyer."
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-200">Unit Price (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="24.99"
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-200">Unit Cost (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                  placeholder="11.40"
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleEnrich}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{isLoading ? "Generating..." : "Enrich with AI ✨"}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !enrichedData?.aiData}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-medium text-emerald-200 transition hover:border-emerald-500/30 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isSaving ? "Saving..." : "Save to Database"}</span>
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">AI Suggestions</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Enrichment Review</h2>
            </div>
            {embeddingExists ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Hugging Face ML Vector Generated ✅
              </span>
            ) : null}
          </div>

          {enrichedData?.aiData ? (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Primary Category</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {enrichedData.aiData.primaryCategory}
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Sub-category</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {enrichedData.aiData.subCategory}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <Tag className="h-4 w-4 text-sky-300" />
                  SEO Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {enrichedData.aiData.seoTags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <Leaf className="h-4 w-4 text-emerald-300" />
                  Sustainability Filters
                </div>
                <div className="flex flex-wrap gap-2">
                  {enrichedData.aiData.sustainabilityFilters?.map((filter) => (
                    <span
                      key={filter}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-100"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/70 p-8 text-center text-zinc-500">
              Run AI enrichment to preview category suggestions, SEO tags, sustainability filters, and the ML vector status.
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}

export default ProductOnboardingPage;
