import fluxx from "@mohayonao/fluxx";

export default class Client extends fluxx.Router {
  constructor(socket, namespace = "fluxx") {
    super();

    this.socket = socket;
    this.namespace = namespace;

    socket.emit("/fluxx/join", { namespace });

    socket.on("/fluxx/sendAction", ({ address, data }) => {
      this.createAction(address, data);
    });
  }

  sendAction(address, data) {
    if (typeof address === "string" && address[0] === "/") {
      this.socket.emit("/fluxx/sendAction", { address, data });
    }
  }
}
