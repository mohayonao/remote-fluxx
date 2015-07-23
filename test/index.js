import assert from "power-assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import { Router, Action, Store } from "@mohayonao/fluxx";
import { JOIN } from "../src/symbols";
import Client from "../src/Client";
import Server from "../src/Server";
import fluxx from "../src";

describe("fluxx", () => {
  describe("exports", () => {
    it("works", () => {
      assert(fluxx.Router === Router);
      assert(fluxx.Action === Action);
      assert(fluxx.Store === Store);
      assert(fluxx.Client === Client);
      assert(fluxx.Server === Server);
    });
  });
  describe("works", () => {
    let socket;

    beforeEach(() => {
      socket = new EventEmitter();
      socket.emit = sinon.spy(socket.emit.bind(socket));
      socket.to = sinon.spy(() => socket);
    });

    function prepare() {
      let server = new Server(socket, "foo");
      let client = new EventEmitter();

      server.emit = sinon.spy(server.emit.bind(server));
      client.join = sinon.spy();

      socket.emit("connect", client);
      client.emit("/fluxx/join", { namespace: "foo" });

      return [ server, client ];
    }

    it("connecting", () => {
      let [ server, client ] = prepare();

      assert.deepEqual(server.clients, [ client ]);

      assert(server.emit.callCount === 1);
      assert(server.emit.args[0][0] === "connect");
      assert.deepEqual(server.emit.args[0][1], { client });

      assert(client.join.callCount === 1);
      assert(client.join.args[0][0] === server.namespace);
    });
    it("connecting (given other app name)", () => {
      let server = new Server(socket, "foo");
      let client = new EventEmitter();

      server[JOIN] = sinon.spy();

      socket.emit("connect", client);
      client.emit("/fluxx/join", "bar");

      assert(server[JOIN].callCount === 0);
    });
    it("messaging: client -> server", () => {
      let client = prepare()[1];

      client.emit = sinon.spy(client.emit.bind(client));

      client.sendAction("/foo", "data1");

      assert(client.emit.callCount === 1);
      assert(client.emit.args[0][0] === "/fluxx/sendAction");
      assert.deepEqual(client.emit.args[0][1], { address: "/foo", data: "data1" });

      client.sendAction("bar", "data2");
      assert(client.emit.callCount === 1);
    });
    it("messaging: server -> client", () => {
      let [ server, client ] = prepare();

      server.createAction = sinon.spy(server.createAction.bind(server));

      client.emit("/fluxx/sendAction", { address: "/foo", data: "data1" });

      assert(server.createAction.callCount === 1);
      assert(server.createAction.args[0][0] === "/foo");
      assert(server.createAction.args[0][1] === "data1");
    });
    it("disconnecting", () => {
      let [ server, client ] = prepare();

      server.emit = sinon.spy(server.emit.bind(server));

      client.emit("disconnect");

      assert.deepEqual(server.clients, []);
      assert(server.emit.callCount === 1);
      assert(server.emit.args[0][0] === "disconnect");
      assert.deepEqual(server.emit.args[0][1], { client });

      client.emit("disconnect");

      assert.deepEqual(server.clients, []);
      assert(server.emit.callCount === 1);
      assert(server.emit.args[0][0] === "disconnect");
      assert.deepEqual(server.emit.args[0][1], { client });
    });
  });
});
