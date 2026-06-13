0document.getElementById("subscribe-basic").onclick = async () => {
  const res = await fetch(`${API_BASE}/billing/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID, plan: "basic" }),
  });

  const data = await res.json();
  window.location.href = data.url;
};

document.getElementById("subscribe-pro").onclick = async () => {
  const res = await fetch(`${API_BASE}/billing/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID, plan: "pro" }),
  });

  const data = await res.json();
  window.location.href = data.url;
};
async function loadApiKey() {
  const res = await fetch(`${API_BASE}/apikey/current`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  document.getElementById("api-key-display").innerText =
    data.api_key || "No API key yet";
}

document.getElementById("generate-api-key").onclick = async () => {
  const res = await fetch(`${API_BASE}/apikey/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  document.getElementById("api-key-display").innerText = data.api_key;
};

loadApiKey();
async function loadDomain() {
  const res = await fetch(`${API_BASE}/domain/current`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const data = await res.json();

  document.getElementById("custom-domain").value = data.custom_domain || "";
  document.getElementById("domain-status").innerText =
    data.domain_verified ? "Verified" : "Not Verified";
}

document.getElementById("save-domain").onclick = async () => {
  const domain = document.getElementById("custom-domain").value;

  await fetch(`${API_BASE}/domain/set`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ domain })
  });

  alert("Domain saved. Now verify it.");
};

document.getElementById("verify-domain").onclick = async () => {
  const domain = document.getElementById("custom-domain").value;

  const res = await fetch(`${API_BASE}/domain/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ domain })
  });

  const data = await res.json();

  document.getElementById("domain-status").innerText =
    data.verified ? "Verified" : "Verification Failed";
};

loadDomain();
