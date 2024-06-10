const orderController = require("./orderController");

const sendInitialOptions = (socket) => {
  //initial message
  const options =
    "Welcome to naija resturbot, Please select an option:\n1: Place an order\n99: Checkout order\n98: See order history\n97: See current order\n0: Cancel order";
  socket.emit("message", { text: options });
};

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
