const messageController = require("../controllers/messageController");

let sessions = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    const sessionId = socket.id;
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        currentOrder: [],
        orderHistory: [],
        userState: "mainMenu"
      };
    }

    messageController.sendInitialOptions(socket);

    socket.on("message", (msg) => {
      const session = sessions[sessionId];

      if (session) {
        messageController.handleUserInput(socket, session, msg);
      }
    });
  });
};
