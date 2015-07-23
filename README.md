# REMOTE FLUXX
[![Build Status](http://img.shields.io/travis/mohayonao/remote-fluxx.svg?style=flat-square)](https://travis-ci.org/mohayonao/remote-fluxx)
[![NPM Version](http://img.shields.io/npm/v/@mohayonao/remote-fluxx.svg?style=flat-square)](https://www.npmjs.org/package/@mohayonao/remote-fluxx)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> simple implementation of Flux architecture via network

## Installation

```
npm install @mohayonao/remote-fluxx
```

## API
### Server
- `constructor(socket: Socket, namespace: string)`

#### Instance attributes
- `socket: Socket`
- `namespace: string`
- `clients: object[]`

#### Instance methods
- `sendAction(address: string, data: any):  void`

### Client
- `constructor(socket: Socket, namespace: string)`

#### Instance attributes
- `socket: Socket`
- `namespace: string`

#### Instance methods
- `sendAction(address: string, data: any):  void`

## LICENSE
MIT
