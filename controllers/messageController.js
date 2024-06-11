const orderController = require("./ordercontroller");

/**
 * Sends the initial options message to the user via the socket.
 *
 * @param {Object} socket - The socket instance to send the message to.
 */
const sendInitialOptions = (socket) => {
  //initial message
  const options = `Welcome to <b><i>Naija Resturbot</i></b>, Please select an option:<br>\n1: Check menu and place an order<br>\n99: Checkout order <br>\n98: See order history<br>\n97: See current order<br>\n0: Cancel order`;
  socket.emit("message", { text: options });
};

/**
 * Handles user input messages and updates the session state accordingly.
 *
 * @param {Object} socket - The socket instance through which the message was received.
 * @param {Object} session - The user's session object.
 * @param {string} msg - The message received from the user.
 */
const handleUserInput = (socket, session, msg) => {
  switch (msg) {
    case "1":
      session.userState === "ordering"
        ? orderController.handleOrderSelection(socket, session, msg)
        : orderController.sendMenu(socket, session);
      session.userState = "ordering";
      break;
    case "99":
      orderController.checkoutOrder(socket, session);
      session.userState = "mainMenu";
      break;
    case "98":
      orderController.showOrderHistory(socket, session);
      break;
    case "97":
      orderController.showCurrentOrder(socket, session);
      break;
    case "0":
      orderController.cancelOrder(socket, session);
      session.userState = "mainMenu";
      break;
    default:
      if (session.userState === "ordering") {
        orderController.handleOrderSelection(socket, session, msg);
      } else {
        socket.emit("message", { text: "Invalid option. Please try again." });
      }
      break;
  }
};

module.exports = {
  sendInitialOptions,
  handleUserInput
};
