const express = require("express");
const http = require("http");
const app = express();
const socketIo = require("socket.io");
const chatRouter = require("./routes/chat");
require("dotenv").config();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.static("public"));
//router
chatRouter(io);
server.listen(PORT, () => console.log(`listening on ${PORT}`));
