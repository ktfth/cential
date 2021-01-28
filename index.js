'use strict';
const fs = require('fs');
const assert = require('assert');

let root = {};

function store(key, value) {
  this.root[key] = value;
  return this.root;
}
assert.deepEqual(store.call({ root: {} }, 'foo', 'bar'), { 'foo': 'bar' }, 'Store engine structure');

function Engine() {
  this.root = {};
}
assert.ok((new Engine()) instanceof Engine, 'Engine instantiation');
Engine.prototype.store = function() { return store.apply(this, Array.from(arguments)); }
assert.deepEqual((new Engine()).store('foo', 'bar'), { 'foo': 'bar' });

function write(filePath='./engine.db') {
  let data = null;
  if (fs.existsSync(filePath)) {
    let curr = JSON.parse(fs.readFileSync(filePath));
    Object.keys(this.root).map(k => curr[k] = this.root[k]);
    data = JSON.stringify(curr);
  } else {
    data = JSON.stringify(this.root);
  }
  fs.writeFileSync(filePath, data);
  return data;
}
assert.deepEqual(write.call({root: { 'foo': 'bar' }}), JSON.stringify({ 'foo': 'bar' }));
assert.ok(fs.existsSync('./engine.db'));

Engine.prototype.write = function() { return write.apply(this, Array.from(arguments)); }
assert.deepEqual((new Engine()).write(), JSON.stringify({ 'foo': 'bar' }));

assert.ok((new Engine()).root !== undefined);

let engine = new Engine();
engine.store('foo', 'bar');
assert.deepEqual(engine.root, { 'foo': 'bar' });
engine.write();
assert.deepEqual(JSON.parse(fs.readFileSync('./engine.db')), { 'foo': 'bar' });

fs.unlinkSync('./engine.db');
