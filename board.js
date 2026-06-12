const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6eWkypZ_O_QoaldUrQvp3KfwsjoawjalQHLftzyI1e0hg2u1MbrQdlGTkDUnEYayFlA/exec";

function safeText(text) {
  return String(text || "")
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return value;
  }
}

function parseItems(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function priorityClass(priority) {
  if (priority === "Emergency") return "priority-emergency";
  if (priority === "Rush") return "priority-rush";
  return "priority-normal";
}

async function loadOrders() {
  const list = document.getElementById("orderBoardList");
  const debug = document.getElementById("orderDebug");
  if (!list) return;

  list.innerHTML = "<p class='admin-note'>Loading shared orders...</p>";

  try {
    const response = await fetch(GOOGLE_SHEET_WEB_APP_URL + "?v=" + Date.now());
    const data = await response.json();
    const orders = Array.isArray(data.orders) ? data.orders.reverse() : [];

    if (debug) debug.textContent = "Shared orders found: " + orders.length;

    if (!orders.length) {
      list.innerHTML = "<p class='admin-note'>No orders submitted yet.</p>";
      return;
    }

    list.innerHTML = orders.map(order => {
      const items = parseItems(order.items);
      const itemHtml = items.length ? items.map(item => `
        <div class="order-item-line">
          <span>${safeText(item.name || "Item")}</span>
          <strong>${safeText(item.qty || "")} ${safeText(item.unit || "")}</strong>
        </div>
      `).join("") : "<p class='admin-note'>No item details found.</p>";

      return `
        <div class="order-card">
          <div class="order-card-head">
            <div>
              <h3>${safeText(order.job || "Unknown Job")}</h3>
              <span>${safeText(formatDate(order.timestamp))}</span>
            </div>
            <span class="review-priority-select ${priorityClass(order.priority)}">${safeText(order.priority || "Normal")}</span>
          </div>

          <div class="order-meta">
            <span><strong>Requested By:</strong> ${safeText(order.requestedBy || "Unknown")}</span>
            <span><strong>Status:</strong> ${safeText(order.status || "Pending")}</span>
          </div>

          <div class="order-items">${itemHtml}</div>
          ${order.notes ? `<div class="order-notes"><strong>Notes:</strong> ${safeText(order.notes)}</div>` : ""}
        </div>
      `;
    }).join("");
  } catch (error) {
    console.error(error);
    if (debug) debug.textContent = "";
    list.innerHTML = "<p class='admin-error'>Could not load shared orders. Check Apps Script deployment permissions.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("refreshOrdersBtn");
  if (btn) btn.addEventListener("click", loadOrders);
  loadOrders();
});
