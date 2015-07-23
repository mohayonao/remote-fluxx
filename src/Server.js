import fluxx from "@mohayonao/fluxx";
import { JOIN } from "./symbols";

export default class Server extends fluxx.Router {
  constructor(socket, namespace = "fluxx") {
    super();

    this.socket = socket;
    this.namespace = namespace;
    this.clients = [];

    socket.on("connect", (client) => {
      client.once("/fluxx/join", ({ namespace }) => {
        if (this.namespace === namespace) {
          this[JOIN](client);
        }
      });
    });
  }

  sendAction(address, data) {
    if (typeof address === "string" && address[0] === "/") {
      this.socket.to(this.namespace).emit("/fluxx/sendAction", { address, data });
    }
  }

  [JOIN](client) {
    client.sendAction = (address, data) => {
      if (typeof address === "string" && address[0] === "/") {
        client.emit("/fluxx/sendAction", { address, data });
      }
    };

    this.clients.push(client);

    this.emit("connect", { client });

    client.on("disconnect", () => {
      let index = this.clients.indexOf(client);

      if (index === -1) {
        return;
      }

      this.clients.splice(index, 1);

      this.emit("disconnect", { client });
    });

    client.on("/fluxx/sendAction", ({ address, data }) => {
      this.createAction(address, data);
    });

    client.join(this.namespace);
  }
}
