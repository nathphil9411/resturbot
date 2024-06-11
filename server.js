const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const socketIo = require("socket.io");
const chatRouter = require("./routes/chat");
require("dotenv").config();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

/**
 * Middleware to serve static files from the "public" directory.
 */
app.use(express.static("public"));

app.use("/docs", express.static(path.join(__dirname, "docs")));

/**
 * Initializes the chat router with the socket.io server instance.
 *
 * @param {Object} io - The socket.io server instance.
 */
chatRouter(io);

/**
 * Starts the server and listens on the specified port.
 *
 * @param {number} PORT - The port number the server listens on.
 */
server.listen(PORT, () => console.log(`listening on ${PORT}`));
