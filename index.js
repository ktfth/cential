'use strict';
const fs = require('fs');
const crypto = require('crypto');
const assert = require('assert');

function Limits(opts={}) {
  this.size = opts.size || 10000;
}
exports.Limits = Limits;

function uuid(len=8) {
  return crypto.randomBytes(Math.ceil(Math.max(8, len * 2)))
    .toString('base64')
    .replace(/[+\/]/g, '')
    .slice(0, len);
}

Limits.prototype.generate = function () {
  let out = {};
  for (let i = 0; i < this.size; i += 1) {
    out[uuid()] = uuid();
  }
  out.sizeOf = () => this.size;
  return out;
};

function DataBuilder(opts={}) {
  this.data = {};
  if (opts.filePath !== undefined && fs.existsSync(opts.filePath) && !opts.cleanRoot) {
    let curr = JSON.parse(fs.readFileSync(opts.filePath));
    Object.keys(opts.root).map(k => curr[k] = opts.root[k]);
    this.data = JSON.stringify(curr);
  } else {
    this.data = JSON.stringify(opts.root);
  }
}
exports.DataBuilder = DataBuilder;

DataBuilder.prototype.dump = function () {
  return this.data;
};

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
  let dataBuilder = new DataBuilder({
    filePath: filePath,
    cleanRoot: cleanRoot,
    root: this.root
  });
  let data = dataBuilder.dump();
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
  this.engine.write.call(this.engine);
}
exports.Storage = Storage;

Storage.prototype.set = function () {
  this.engine.store.apply(this.engine, Array.from(arguments));
  this.engine.write.call(this.engine);
  return this;
};

Storage.prototype.get = function () {
  const args = Array.from(arguments);
  if (args.length) return this.engine.get.apply(this.engine, args);
  return this.engine.read.call(this.engine);
};

Storage.prototype.update = function () {
  this.engine.store.apply(this.engine, Array.from(arguments));
  this.engine.write.call(this.engine);
  return this;
};

Storage.prototype.delete = function () {
  this.engine.unstore.apply(this.engine, Array.from(arguments));
  this.engine.write.call(this.engine, true);
  return this;
};
