'use strict';
const fs = require('fs');
const assert = require('assert');

let root = {};

function store(key, value) {
  this.root[key] = value;
  return this.root;
}
exports.store = store;

function Engine(opts) {
  const self = this;
  this.root = {};

  if (typeof(opts) === 'object') {
    Object.keys(opts).map(k => self[k] = opts[k]);
  }
}
exports.Engine = Engine;
Engine.prototype.store = function() { return store.apply(this, Array.from(arguments)); };
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
assert.deepEqual(write.call({ root: { 'foo': 'bar' } }), JSON.stringify({ 'foo': 'bar' }));
assert.ok(fs.existsSync('./engine.db'));

Engine.prototype.write = function() {
  let args = [];
  let _cachedArgs = Array.from(arguments);
  if (this.dbPath !== undefined) {
    args.push(this.dbPath);
  }
  _cachedArgs.map(v => args.push(v));
  return write.apply(this, args);
};
assert.deepEqual((new Engine()).write(), JSON.stringify({ 'foo': 'bar' }));

assert.ok((new Engine()).root !== undefined);

let engine = new Engine();
engine.store('foo', 'bar');
assert.deepEqual(engine.root, { 'foo': 'bar' });
engine.write();
assert.deepEqual(JSON.parse(fs.readFileSync('./engine.db')), { 'foo': 'bar' });

function read() {
  return JSON.parse(fs.readFileSync(this.dbPath));
}

let sampleRoot = {};
store.call({ root: sampleRoot }, 'foo', 'baz');
write.call({ root: sampleRoot }, './custom-engine.db');
assert.deepEqual(read.call({ dbPath: './custom-engine.db' }), { 'foo': 'baz' });

Engine.prototype.read = function () { return read.apply(this, Array.from(arguments)); };

let customEngine = new Engine({ dbPath: './custom-engine.db' });
customEngine.store('foo', 'baz');
customEngine.write();
assert.deepEqual(customEngine.read(), { 'foo': 'baz' });

function unstore(key) {
  delete this.root[key];
  return this.root;
}

store.call({ root: sampleRoot }, 'bar', 'biz');
unstore.call({ root: sampleRoot }, 'bar');
assert.deepEqual(sampleRoot, { 'foo': 'baz' });

Engine.prototype.unstore = function () { return unstore.apply(this, Array.from(arguments)); };

customEngine.store('bar', 'biz');
customEngine.unstore('bar');
assert.deepEqual(customEngine.root, { 'foo': 'baz' });

function get(key) {
  return this.root[key];
}

assert.equal(get.call({ root: sampleRoot }, 'foo'), 'baz');

Engine.prototype.get = function () { return get.apply(this, Array.from(arguments)) };

assert.equal(customEngine.get('foo'), 'baz');

fs.unlinkSync('./custom-engine.db');
fs.unlinkSync('./engine.db');
