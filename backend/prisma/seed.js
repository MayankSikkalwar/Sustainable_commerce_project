const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Inserts a small, interview-friendly sample catalog into MongoDB.
 *
 * Why the `embedding` field is empty:
 * The project will later generate ML embeddings from product text using
 * Hugging Face. During Phase 1, we intentionally seed `embedding: []`
 * so the database shape is ready before any vector logic is introduced.
 */
async function main() {
  const products = [
    {
      name: "Bamboo Breeze Toothbrush Set",
      description:
        "A pack of biodegradable bamboo toothbrushes with soft charcoal bristles and plastic-free kraft packaging.",
      primaryCategory: "Personal Care",
      subCategory: "Oral Care",
      seoTags: ["bamboo toothbrush", "zero waste bathroom", "eco oral care", "plastic free hygiene", "sustainable self care"],
      sustainabilityFilters: ["biodegradable", "plastic-free", "renewable-materials"],
      price: 12.99,
      cost: 5.1,
      embedding: [],
    },
    {
      name: "LoopCycle Recycled Notebook",
      description:
        "A premium office notebook made from 100 percent post-consumer recycled paper with soy-based inks.",
      primaryCategory: "Office Supplies",
      subCategory: "Stationery",
      seoTags: ["recycled notebook", "sustainable stationery", "eco office", "soy ink notebook", "green supplies"],
      sustainabilityFilters: ["recycled-materials", "low-waste", "responsibly-made"],
      price: 9.49,
      cost: 3.85,
      embedding: [],
    },
    {
      name: "TerraSip Stainless Steel Bottle",
      description:
        "An insulated stainless steel water bottle that keeps drinks cold for 24 hours and replaces single-use plastic bottles.",
      primaryCategory: "Lifestyle",
      subCategory: "Reusable Drinkware",
      seoTags: ["steel water bottle", "reusable bottle", "plastic alternative", "eco lifestyle", "insulated bottle"],
      sustainabilityFilters: ["reusable", "plastic-reduction", "durable-design"],
      price: 24.99,
      cost: 11.4,
      embedding: [],
    },
    {
      name: "SunWeave Organic Cotton Tote",
      description:
        "A washable everyday tote bag made from certified organic cotton and designed for grocery runs or daily commuting.",
      primaryCategory: "Fashion",
      subCategory: "Bags",
      seoTags: ["organic cotton tote", "reusable shopping bag", "sustainable fashion", "eco tote bag", "daily carry"],
      sustainabilityFilters: ["organic", "reusable", "ethical-sourcing"],
      price: 18.5,
      cost: 7.2,
      embedding: [],
    },
  ];

  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
