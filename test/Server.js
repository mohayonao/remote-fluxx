import assert from "power-assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import fluxx from "@mohayonao/fluxx";
import Server from "../src/Server";

describe("Server", () => {
  let socket;

  beforeEach(() => {
    socket = new EventEmitter();
    socket.emit = sinon.spy(socket.emit.bind(socket));
    socket.to = sinon.spy(() => socket);
  });

  describe("constructor(socket: Socket, namespace: string)", () => {
    it("works", () => {
      let server = new Server(socket, "foo");

      assert(server instanceof Server);
      assert(server instanceof fluxx.Router);
      assert(Array.isArray(server.clients));
    });
  });
  describe("#sendAction(address: string, data: any): void", () => {
    it("works", () => {
      let server = new Server(socket);
      let data = {};

      socket.emit.reset();

      server.sendAction("/foo", data);

      assert(socket.emit.callCount === 1);
      assert(socket.emit.args[0][0] === "/fluxx/sendAction");
      assert.deepEqual(socket.emit.args[0][1], { address: "/foo", data: data });

      server.sendAction("bar", data);

      assert(socket.emit.callCount === 1);
    });
  });
});
