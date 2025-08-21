const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginAdmin(password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { token }
}

export async function createOrder(order) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error("Order aanmaken mislukt");
  return res.json();
}

export async function getOrders({ page = 1, limit = 10, status = "" } = {}) {
  const qs = new URLSearchParams();
  qs.set("page", page);
  qs.set("limit", limit);
  if (status) qs.set("status", status);

  const res = await fetch(`${API_URL}/orders?${qs.toString()}`);
  if (!res.ok) throw new Error("Orders laden mislukt");
  return res.json(); // { page, limit, total, totalPages, items }
}

export async function getOrderById(id) {
  const res = await fetch(`${API_URL}/orders/${id}`);
  if (!res.ok) throw new Error("Order niet gevonden");
  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Status updaten mislukt");
  return res.json();
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error("Order verwijderen mislukt");
  return res.json();
}
