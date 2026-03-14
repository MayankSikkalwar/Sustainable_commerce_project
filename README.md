<div align="center">

# 🌿 Rayeva AI Systems  
## Sustainable Commerce Admin Console

A **decoupled, full-stack AI platform** integrating **Generative AI (Groq/Llama 3.1)** and **Machine Learning (Hugging Face)** to automate e-commerce cataloging and generate **hallucination-free B2B sales proposals** via **RAG (Retrieval-Augmented Generation).**

</div>

---

# 🎯 Submission Quick Links

🎬 **Watch the Demo:** https://www.loom.com/share/0756710c5bdc4c84a650008879e3d312 

👨‍💻 **Developer:** Mayank Sikkalwar (3rd Year CSE)

---

# ✨ Implemented Features (Completed Modules)

## 🏷️ Module 1: AI Auto-Category & Catalog Enrichment

- **Zero-Touch Tagging**  
Automatically generates **SEO tags and sustainability filters** from raw product descriptions.

- **ML Vector Generation**  
Creates a **384-dimensional vector** using Hugging Face model  
`all-MiniLM-L6-v2` and stores it in **MongoDB**.

- **Strict JSON Output**  
Forces Groq LLM to return **validated JSON output** matching the database schema.

---

## 💼 Module 2: Smart B2B Proposal Generator (RAG Integration)

- **Semantic Vector Search**  
Converts client prompts into vectors and performs **Cosine Similarity search** in MongoDB.

- **Budget-Aware Generation**  
Injects only **top-matched eco-friendly products with real ₹ prices** into LLM context.

- **Print-Ready UI**  
Generates **professional invoices/quotes** which can be exported as **clean PDFs**.

---

# 🏗️ System Architecture

The application follows the **MVC (Model-View-Controller) architecture**, ensuring the **React frontend is fully decoupled from AI logic**.

| Layer | Technology | Responsibility |
|------|-----------|---------------|
| 🎨 Presentation | React, Vite, Tailwind | Renders dashboard, manages forms, handles PDF generation |
| ⚙️ Controller | Node.js, Express.js | Handles API requests, RAG logic, and DB communication |
| 🧠 Service Layer | Groq SDK, Hugging Face | Manages AI APIs (`ai.js`, `ml.js`) and logging |
| 🗄️ Database | MongoDB Atlas, Prisma | Stores Products, Proposals, and AI Logs |

---

# 🔮 Architecture Outline for Remaining Modules

### Module 3: Dynamic Eco-Scoring
- Implemented via **Prisma Database Trigger**
- Worker passes product material data to **Groq**
- Groq returns **eco score (1–100)** using structured JSON
- Score stored in **EcoScore table**

### Module 4: WhatsApp Support Bot
- Built using **Twilio Webhook**

Workflow:

User Message → Twilio → Backend API  
→ HuggingFace Sentiment Analysis  
→ Groq Intent Classification  
→ MongoDB Query  
→ Response back to WhatsApp

---

# 🔐 AI Prompt Design & Grounding Strategy

To ensure **enterprise-grade AI reliability**, the following techniques are used:

### 🛡️ System & User Prompt Isolation
- System prompts define rules and AI persona
- User prompts contain **sanitized product data only**
- Prevents **prompt injection attacks**

### 📐 Constrained JSON Enforcement
Groq API forced to return structured JSON

```
response_format: { type: "json_object" }
```

The prompt contains a **strict JSON template**, forcing the model to choose values from predefined arrays.

Example:

```
["Utensils", "Drinkware", "Cookware"]
```

---

### ⚓ RAG Hallucination Prevention

Instead of asking the LLM directly:

1️⃣ Backend performs **vector similarity search**  
2️⃣ Retrieves **top 5 real products** from MongoDB  
3️⃣ Sends only those products to LLM  

Result: **No fake products or hallucinated prices.**

---

### 📝 100% Audit Logging

Every AI request and response is stored in:

```
AILog Collection
```

This enables **security auditing and debugging**.

---

# 🚀 Quick Start (Local Setup)

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/MayankSikkalwar/Sustainable_commerce_project.git
cd SUSTAINABLE_COMMERCE_PROJECT
```

---

## 2️⃣ Start Backend

```bash
cd backend
npm install
```

Create `.env` file:

```
DATABASE_URL=
GROQ_API_KEY=
HUGGINGFACE_API_KEY=
```

Run backend:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

---

## 3️⃣ Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

<div align="center">

### ✨ Designed and developed for the  
**Rayeva AI Systems Internship Assignment**

</div>
