const API_BASE = "http://localhost:3001/api";

async function loadClients() {
  const res = await fetch(`${API_BASE}/admin/clients`);
  const clients = await res.json();

  const tbody = document.querySelector("#clients-table tbody");
  tbody.innerHTML = "";

  clients.forEach(client => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${client.id}</td>
      <td>${client.business_name}</td>
      <td>${client.domain}</td>
      <td>${client.plan}</td>
      <td>${client.status}</td>
      <td>
        <button onclick="suspendClient('${client.id}')">Suspend</button>
        <button onclick="activateClient('${client.id}')">Activate</button>
        <button onclick="deleteClient('${client.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function suspendClient(id) {
  await fetch(`${API_BASE}/admin/clients/suspend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  loadClients();
}

async function activateClient(id) {
  await fetch(`${API_BASE}/admin/clients/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  loadClients();
}

async function deleteClient(id) {
  await fetch(`${API_BASE}/admin/clients/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  loadClients();
}

document.getElementById("add-client-btn").addEventListener("click", () => {
  document.getElementById("new-client-section").style.display = "block";
});

document.getElementById("save-client-btn").addEventListener("click", async () => {
  const id = document.getElementById("new-client-id").value;
  const name = document.getElementById("new-client-name").value;
  const domain = document.getElementById("new-client-domain").value;

  await fetch(`${API_BASE}/admin/clients/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, domain }),
  });

  loadClients();
});

loadClients();
