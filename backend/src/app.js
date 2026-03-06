const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/product.routes");

const app = express();

/**
 * Cross-Origin Resource Sharing (CORS) tells the browser which frontend origins
 * are allowed to call this backend.
 *
 * Why this matters in this project:
 * - The React app will usually run on a Vite dev server such as
 *   `http://localhost:5173`.
 * - The Express API will run on a different origin such as
 *   `http://localhost:5000`.
 * - Browsers treat that frontend-to-backend call as cross-origin, so without
 *   this middleware the browser can block the request before our route handler
 *   even executes.
 *
 * What `cors()` does here:
 * - It adds response headers like `Access-Control-Allow-Origin`.
 * - Those headers tell the browser that this API explicitly permits requests
 *   from the frontend during development.
 * - For interview discussion, you can say CORS is a browser security policy and
 *   this middleware configures the server-side headers needed to satisfy it.
 *
 * We keep the configuration narrow instead of using a wildcard so the intended
 * frontend origin is explicit and easy to discuss.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

/**
 * Route composition layer.
 *
 * `app.js` should act as the application assembly point:
 * - global middleware is registered here,
 * - feature routers are mounted here,
 * - feature implementation details stay inside route/controller/service files.
 *
 * This keeps the Express entrypoint small and makes the system easier to grow
 * as new SaaS modules are added.
 */
app.use("/api/products", productRoutes);

app.get("/api/health", async (_request, response) => {
  response.json({
    ok: true,
    message: "Sustainable commerce backend is running.",
  });
});

module.exports = app;
