# Cential

## Description

A small database engine made for fun

## Usage

```sh
[sudo] npm i cential
```

```js
const { Storage } = require('cential');
const storage = new Storage();

storage.create('foo', 'bar'); // Create a key with data
storage.read() // all data from root engine
storage.read('foo') // a specific value from engine root
storage.update('foo', 'biz'); // update an value
storage.delete('foo'); // remove a specific node
```

## Contribute

All discussions arround that problem are welcome to improve this engine
