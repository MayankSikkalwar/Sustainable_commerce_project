const API_BASE_URL = "http://localhost:5000/api";

/**
 * Central API helper for frontend-to-backend communication.
 *
 * Why this file should exist instead of calling `fetch()` directly inside React
 * components:
 * - Components should focus on rendering UI and handling interaction state.
 * - Networking is an infrastructure concern and should be isolated so headers,
 *   base URLs, error handling, and authentication logic can be changed in one
 *   place later.
 * - In scalable SaaS applications, this separation prevents duplicated request
 *   code across many pages and makes the frontend easier to test because UI and
 *   transport logic are no longer tightly coupled.
 */
async function apiClient(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

apiClient.baseURL = API_BASE_URL;

/**
 * Helper for JSON POST requests.
 *
 * This lets page components express intent with `apiClient.post(...)` instead
 * of repeatedly rebuilding method, headers, and body serialization logic.
 */
apiClient.post = function post(path, payload) {
  return apiClient(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export default apiClient;
