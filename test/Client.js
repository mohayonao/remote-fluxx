import assert from "power-assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import fluxx from "@mohayonao/fluxx";
import Client from "../src/Client";

describe("Client", () => {
  let socket;

  beforeEach(() => {
    socket = new EventEmitter();
    socket.emit = sinon.spy(socket.emit.bind(socket));
  });

  describe("constructor(socket: Socket, namespace: string)", () => {
    it("works", () => {
      let client = new Client(socket, "foo");

      assert(client instanceof Client);
      assert(client instanceof fluxx.Router);
      assert(client.socket === socket);
      assert(client.namespace === "foo");
      assert(socket.emit.callCount === 1);
      assert(socket.emit.args[0][0] === "/fluxx/join");
      assert.deepEqual(socket.emit.args[0][1], { namespace: "foo" });

      let data = {};

      client.createAction = sinon.spy(client.createAction.bind(client));

      socket.emit("/fluxx/sendAction", { address: "/foo", data: data });

      assert(client.createAction.callCount === 1);
      assert(client.createAction.args[0][0] === "/foo");
      assert(client.createAction.args[0][1] === data);
    });
  });
  describe("#sendAction(address: string, data: any): void", () => {
    it("works", () => {
      let client = new Client(socket);
      let data = {};

      socket.emit.reset();

      client.sendAction("/foo", data);

      assert(socket.emit.callCount === 1);
      assert(socket.emit.args[0][0] === "/fluxx/sendAction");
      assert.deepEqual(socket.emit.args[0][1], { address: "/foo", data: data });

      client.sendAction("bar", {});

      assert(socket.emit.callCount === 1);
    });
  });
});
