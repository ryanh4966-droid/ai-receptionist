const CLIENT_ID = "demo-client";
const API_BASE = "http://localhost:3001/api";

async function loadAnalytics() {
  const res = await fetch(`${API_BASE}/analytics?client_id=${CLIENT_ID}`);
  const data = await res.json();

  document.getElementById("total-leads").innerText = data.totalLeads;
  document.getElementById("total-conversations").innerText = data.totalConversations;
  document.getElementById("total-bookings").innerText = data.totalBookings;

  const labels = data.dailyLeads.map(row => row.day);
  const counts = data.dailyLeads.map(row => row.count);

  new Chart(document.getElementById("leadsChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Daily Leads",
        data: counts,
        borderColor: "#4a90e2",
        fill: false
      }]
    }
  });
}

loadAnalytics();
