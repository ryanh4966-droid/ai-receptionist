const CLIENT_ID = "demo-client";
const API_BASE = "http://localhost:3001/api";

async function loadLeads() {
  const res = await fetch(`${API_BASE}/leads?client_id=${CLIENT_ID}`);
  const leads = await res.json();

  const tbody = document.querySelector("#leads-table tbody");
  tbody.innerHTML = "";

  leads.forEach(lead => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${lead.name || ""}</td>
      <td>${lead.email || ""}</td>
      <td>${lead.phone || ""}</td>
      <td>${lead.message || ""}</td>
      <td>${new Date(lead.created_at).toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadSettings() {
  const res = await fetch(`${API_BASE}/settings?client_id=${CLIENT_ID}`);
  const settings = await res.json();

  document.getElementById("ai-personality").value =
    settings.ai_personality || "";

  document.getElementById("widget-color").value =
    settings.widget_color || "#4a90e2";

  document.getElementById("booking-enabled").checked =
    settings.booking_enabled || false;
}

async function saveSettings() {
  const body = {
    client_id: CLIENT_ID,
    ai_personality: document.getElementById("ai-personality").value,
    widget_color: document.getElementById("widget-color").value,
    booking_enabled: document.getElementById("booking-enabled").checked,
  };

  await fetch(`${API_BASE}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  alert("Settings saved!");
}

document.getElementById("save-settings").addEventListener("click", saveSettings);

loadLeads();
loadSettings();
