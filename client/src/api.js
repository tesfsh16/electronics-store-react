/*
  api.js — the only file that talks to our backend.

  Every function here does one thing: send a request to the server
  and return the data (or throw an error if something went wrong).

  Why keep it all in one file?
  → Easy to find. Easy to change the base URL for deployment.
  → Every other file just imports what it needs from here.
*/

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper: read the token saved in localStorage after login
function getToken() {
  return localStorage.getItem("token");
}

// Helper: build the Authorization header when a token exists
function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper: send a request and handle errors in one place
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw the server's own message so the UI can show it
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function registerUser(name, email, password) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  return request("/api/auth/me");
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function fetchProducts() {
  return request("/api/products");
}

export function fetchProductById(id) {
  return request(`/api/products/${id}`);
}

export function createProduct(data) {
  return request("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id, data) {
  return request(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: "DELETE" });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function placeOrder(orderData) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export function fetchMyOrders() {
  return request("/api/orders/my");
}

export function fetchOrderById(id) {
  return request(`/api/orders/${id}`);
}

// Admin
export function fetchAllOrders() {
  return request("/api/orders");
}

export function updateOrderStatus(id, status) {
  return request(`/api/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export function initializeChapaPayment(orderId) {
  return request("/api/payments/chapa/initialize", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}
