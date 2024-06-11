const items = [
  "Nkwobi",
  "Amala and Ewedu",
  "Tuwo Shinkafa",
  "Owo Soup",
  "Editan Soup",
  "Afang Soup",
  "Banga Soup",
  "Ugbẹkẹrẹ Soup",
  "Ukodo (Yam Pepper Soup)",
  "Ebeji",
  "Pounded Yam and Gbari Soup",
  "Fura da Nono",
  "Okoho Soup",
  "Achicha",
  "Yam Porridge",
  "Waina (Rice Pancakes)",
  "Pounded Yam and Groundnut Soup",
  "Apapa Soup",
  "Gbegiri and Tuwo",
  "Owghwo Soup"
];

/**
 * Sends the menu options to the user via the socket.
 *
 * @param {Object} socket - The socket instance to send the message to.
 * @param {Object} session - The user's session object.
 */
const sendMenu = (socket, session) => {
  let menu = "<b>Please select a meal by number:</b> <br>";
  items.forEach((item, index) => {
    menu += `${index + 1}: ${item}  <br>`;
  });
  socket.emit("message", { text: menu });
};

/**
 * Handles the user's order selection and updates the session state.
 *
 * @param {Object} socket - The socket instance through which the message was received.
 * @param {Object} session - The user's session object.
 * @param {string} msg - The message received from the user.
 */
const handleOrderSelection = (socket, session, msg) => {
  if (session.currentOrder.length === 1) {
    socket.emit("message", {
      text: `please you have an unfinished ${session.currentOrder[0]} order, 99 to checkout or 0 to cancel order`
    });
    return;
  }
  if (session.userState === "ordering") {
    const index = parseInt(msg) - 1;
    if (index >= 0 && index < items.length) {
      session.currentOrder.push(items[index]);
      socket.emit("message", {
        text: `<b>${items[index]}</b>  has been added to your order. Press: 99 to Checkout order \n0: Cancel order`
      });
    } else {
      socket.emit("message", { text: "Invalid selection. Please try again." });
    }
  } else {
    socket.emit("message", { text: "Please select a meal first." });
  }
};

/**
 * Checks out the user's order, moving it to the order history and resetting the current order.
 *
 * @param {Object} socket - The socket instance to send the message to.
 * @param {Object} session - The user's session object.
 */
const checkoutOrder = (socket, session) => {
  if (session.currentOrder.length > 0) {
    session.orderHistory.push([...session.currentOrder]);
    session.currentOrder = [];
    session.state = "mainMenu";
    socket.emit("message", {
      text: "Order placed successfully! Select 1 to place a new order."
    });
  } else {
    socket.emit("message", {
      text: "No order to place. Select 1 to place a new order."
    });
  }
};

/**
 * Shows the user's order history via the socket.
 *
 * @param {Object} socket - The socket instance to send the message to.
 * @param {Object} session - The user's session object.
 */
const showOrderHistory = (socket, session) => {
  if (session.orderHistory.length > 0) {
    const history = session.orderHistory
      .map((order, i) => `Order ${i + 1}: ${order.join(", ")}`)
      .join("\n");
    socket.emit("message", { text: `Order History:\n${history}` });
  } else {
    socket.emit("message", { text: "No order history." });
  }
};

/**
 * Shows the user's current order via the socket.
 *
 * @param {Object} socket - The socket instance to send the message to.
 * @param {Object} session - The user's session object.
 */
const showCurrentOrder = (socket, session) => {
  if (session.currentOrder.length > 0) {
    socket.emit("message", {
      text: `Current Order: ${session.currentOrder.join(", ")}`
    });
  } else {
    socket.emit("message", { text: "No current order." });
  }
};

/**
 * Cancels the user's current order and resets the session state.
 *
 * @param {Object} socket - The socket instance to send the message to.
 * @param {Object} session - The user's session object.
 */
const cancelOrder = (socket, session) => {
  if (session.currentOrder.length > 0) {
    session.currentOrder = [];
    session.state = "mainMenu";
    socket.emit("message", { text: "Order cancelled." });
  } else {
    socket.emit("message", { text: "No order to cancel." });
  }
};

module.exports = {
  sendMenu,
  handleOrderSelection,
  checkoutOrder,
  showOrderHistory,
  showCurrentOrder,
  cancelOrder
};
