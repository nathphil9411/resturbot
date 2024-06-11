const messageController = require("../controllers/messageController");

let sessions = {};

/**
 * Initializes socket.io connection and handles user sessions.
 *
 * @param {Object} io - The socket.io server instance.
 */
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

    /**
     * Handles incoming user messages.
     *
     * @param {string} msg - The message sent by the user.
     */
    socket.on("message", (msg) => {
      const session = sessions[sessionId];

      if (session) {
        messageController.handleUserInput(socket, session, msg);
      }
    });
  });
};
