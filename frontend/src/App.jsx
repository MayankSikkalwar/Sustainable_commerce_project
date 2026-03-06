import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout.jsx";
import ProductOnboardingPage from "./pages/ProductOnboardingPage.jsx";

/**
 * Root application router.
 *
 * Separation-of-concerns explanation:
 * - `App.jsx` should compose high-level route structure, not own feature
 *   details, API calls, or repeated layout markup.
 * - The layout component owns the persistent admin shell.
 * - Page components own route-specific workflow screens.
 * - Reusable UI belongs in `components/`, and networking belongs in `api/`.
 *
 * This structure mirrors common SaaS frontend architecture and makes it easier
 * to scale from one screen into a multi-module admin portal.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/products/new" replace />} />
          <Route path="/dashboard" element={<ProductOnboardingPage />} />
          <Route path="/products/new" element={<ProductOnboardingPage />} />
          <Route path="/proposals" element={<ProductOnboardingPage />} />
          <Route path="/support" element={<ProductOnboardingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
