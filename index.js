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

function write(filePath='./engine.db', cleanRoot=false) {
  let data = null;
  if (fs.existsSync(filePath) && !cleanRoot) {
    let curr = JSON.parse(fs.readFileSync(filePath));
    Object.keys(this.root).map(k => curr[k] = this.root[k]);
    data = JSON.stringify(curr);
  } else {
    data = JSON.stringify(this.root);
  }
  fs.writeFileSync(filePath, data);
  return data;
}
exports.write = write;

Engine.prototype.write = function() {
  let args = [];
  let _cachedArgs = Array.from(arguments);
  if (this.dbPath !== undefined) {
    args.push(this.dbPath);
  }
  _cachedArgs.map(v => args.push(v));
  return write.apply(this, args);
};

function read() {
  return JSON.parse(fs.readFileSync(this.dbPath));
}
exports.read = read;

Engine.prototype.read = function () { return read.apply(this, Array.from(arguments)); };

function unstore(key) {
  delete this.root[key];
  return this.root;
}
exports.unstore = unstore;

Engine.prototype.unstore = function () { return unstore.apply(this, Array.from(arguments)); };

function get(key) {
  return this.root[key];
}
exports.get = get;

Engine.prototype.get = function () { return get.apply(this, Array.from(arguments)) };

function Storage() {
  this.engine = new Engine({
    dbPath: './storage.db'
  });
  this.engine.write();
}
exports.Storage = Storage;

Storage.prototype.create = function () {
  this.engine.store.apply(this.engine, Array.from(arguments));
  this.engine.write();
  return this;
};

Storage.prototype.read = function () {
  const args = Array.from(arguments);
  if (args.length) return this.engine.get.apply(this.engine, args);
  return this.engine.read();
};

Storage.prototype.update = function () {
  this.engine.store.apply(this.engine, Array.from(arguments));
  this.engine.write();
  return this;
};

Storage.prototype.delete = function () {
  this.engine.unstore.apply(this.engine, Array.from(arguments));
  this.engine.write(true);
  return this;
};
