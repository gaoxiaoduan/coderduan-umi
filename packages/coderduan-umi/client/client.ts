function getSocketHost() {
  const url: any = window.location;
  const host = url.host;
  const isHttps = url.protocol === "https:";
  return `${isHttps ? "wss" : "ws"}://${host}`;
}

if ("WebSocket" in window) {
  const socket = new WebSocket(getSocketHost(), "coderduan-umi-hmr");

  let pingTimer: NodeJS.Timer | null = null;
  socket.addEventListener("message", async ({ data }) => {
    data = JSON.parse(data);
    if (data.type === "connected") {
      console.log(`[coderduan-umi] connected.`);
      // 心跳包
      pingTimer = setInterval(() => socket.send("ping"), 1000 * 30);
    }
    if (data.type === "reload") window.location.reload();
  });

  // 等待重连
  async function waitForSuccessfulPing(ms = 1000) {
    while (true) {
      try {
        await fetch(`/__coderduan-umi_ping`);
        break;
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, ms));
      }
    }
  }

  socket.addEventListener("close", async () => {
    if (pingTimer) clearInterval(pingTimer);
    console.info("[coderduan-umi] Dev disconnected. Polling for restart...");
    await waitForSuccessfulPing();
    window.location.reload();
  });
}
