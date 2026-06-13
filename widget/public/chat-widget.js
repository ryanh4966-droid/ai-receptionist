class AIChatWidget {
  constructor(options) {
    this.clientId = options.clientId;
    this.backendUrl = options.backendUrl || "http://localhost:3001/api/chat";
    this.init();
  }

  init() {
    // Create widget container
    this.widget = document.createElement("div");
    this.widget.id = "ai-chat-widget";
    this.widget.innerHTML = `
      <div id="ai-chat-header">Chat with us</div>
      <div id="ai-chat-body"></div>
      <div id="ai-chat-input-container">
        <input id="ai-chat-input" type="text" placeholder="Type a message..." />
        <button id="ai-chat-send">Send</button>
      </div>
    `;
    document.body.appendChild(this.widget);

    // Event listeners
    document
      .getElementById("ai-chat-send")
      .addEventListener("click", () => this.sendMessage());

    document
      .getElementById("ai-chat-input")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.sendMessage();
      });
  }

  addMessage(sender, text) {
    const body = document.getElementById("ai-chat-body");
    const msg = document.createElement("div");
    msg.className = sender === "user" ? "user-msg" : "ai-msg";
    msg.innerText = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  async sendMessage() {
    const input = document.getElementById("ai-chat-input");
    const message = input.value.trim();
    if (!message) return;

    this.addMessage("user", message);
    input.value = "";

    const res = await fetch(this.backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: this.clientId,
        message,
      }),
    });

    const data = await res.json();
    this.addMessage("ai", data.reply || "Error: No response");
  }
}

// Auto-init if script tag includes data attributes
document.addEventListener("DOMContentLoaded", () => {
  const scriptTag = document.querySelector("script[data-ai-widget]");
  if (scriptTag) {
    new AIChatWidget({
      clientId: scriptTag.getAttribute("data-client-id"),
      backendUrl: scriptTag.getAttribute("data-backend-url"),
    });
  }
});
