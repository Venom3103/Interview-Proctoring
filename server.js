const next = require("next");
const http = require("http");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  // Create a plain Node.js server
  const httpServer = http.createServer((req, res) => {
    handle(req, res); // Pass all requests to Next.js
  });

  // Attach Socket.IO to the server
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });
  global._io = io;

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join", ({ sessionId }) => {
      socket.join(sessionId);
      console.log(`User ${socket.id} joined session ${sessionId}`);
    });

    socket.on("event", (ev) => {
      io.to(ev.sessionId || "broadcast").emit("event", ev);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  // Start server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Dev server running on http://localhost:${PORT}`);
  });
});
