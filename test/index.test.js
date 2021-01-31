'use strict';
const fs = require('fs');
const assert = require('assert');

const { DataBuilder, Engine, store, unstore, write, read, get, Storage } = require('../');

describe('DataBuilder', () => {
  after(() => {
    fs.unlinkSync('./data-builder.db');
  });

  it('should be an instance of', () => {
    assert.ok((new DataBuilder()) instanceof DataBuilder);
  });

  it('should construct data across paths', () => {
    fs.writeFileSync('./data-builder.db', JSON.stringify({ 'foo': 'bar' }));

    let dataBuilder = new DataBuilder({
      filePath: './data-builder.db',
      cleanRoot: false,
      root: {}
    });

    assert.equal(dataBuilder.dump(), JSON.stringify({ 'foo': 'bar' }));
  });

  it('should construct data across conditions', () => {
    let dataBuilder = new DataBuilder({
      cleanRoot: true,
      root: { 'foo': 'biz' }
    });

    assert.equal(dataBuilder.dump(), JSON.stringify({ 'foo': 'biz' }));
  });
});

describe('Engine', () => {
  after(() => {
    fs.unlinkSync('./custom-engine.db');
    fs.unlinkSync('./engine.db');
  });

  it('should store data', () => {
    assert.deepEqual(store.call({ root: {} }, 'foo', 'bar'), { 'foo': 'bar' }, 'Store engine structure');
  });

  it('should setup the instance', () => {
    assert.ok((new Engine()) instanceof Engine, 'Engine instantiation');
  });

  it('should store data by instance', () => {
    assert.deepEqual((new Engine()).store('foo', 'bar'), { 'foo': 'bar' });
  });

  it('should write data', () => {
    assert.deepEqual(write.call({ root: { 'foo': 'bar' } }), JSON.stringify({ 'foo': 'bar' }));
  });

  it('should check file existance', () => {
    assert.ok(fs.existsSync('./engine.db'));
  });

  it('should write data by instance', () => {
    assert.deepEqual((new Engine()).write(), JSON.stringify({ 'foo': 'bar' }));
  });

  it('should instance have root', () => {
    assert.ok((new Engine()).root !== undefined);
  });

  it('should have engine.db file created', () => {
    let engine = new Engine();
    engine.store('foo', 'bar');
    assert.deepEqual(engine.root, { 'foo': 'bar' });
    engine.write();
    assert.deepEqual(JSON.parse(fs.readFileSync('./engine.db')), { 'foo': 'bar' });
  });

  let sampleRoot;

  it('should read data', () => {
    sampleRoot = {};
    store.call({ root: sampleRoot }, 'foo', 'baz');
    write.call({ root: sampleRoot }, './custom-engine.db');
    assert.deepEqual(read.call({ dbPath: './custom-engine.db' }), { 'foo': 'baz' });
  });

  let customEngine;

  it('should read data by instance', () => {
    customEngine = new Engine({ dbPath: './custom-engine.db' });
    customEngine.store('foo', 'baz');
    customEngine.write();
    assert.deepEqual(customEngine.read(), { 'foo': 'baz' });
  });

  it('should unstore data', () => {
    store.call({ root: sampleRoot }, 'bar', 'biz');
    unstore.call({ root: sampleRoot }, 'bar');
    assert.deepEqual(sampleRoot, { 'foo': 'baz' });
  });

  it('should unstore data by instance', () => {
    customEngine.store('bar', 'biz');
    customEngine.unstore('bar');
    assert.deepEqual(customEngine.root, { 'foo': 'baz' });
  });

  it('should get data', () => {
    assert.equal(get.call({ root: sampleRoot }, 'foo'), 'baz');
  });

  it('should get data by instance', () => {
    assert.equal(customEngine.get('foo'), 'baz');
  });
});

describe('Storage', () => {
  let storage;

  before(() => {
    storage = new Storage();
  });

  after(() => {
    fs.unlinkSync('./storage.db');
  });

  it('should instantiate the adpter', () => {
    assert.ok(storage instanceof Storage);
  });

  it('should create database', () => {
    assert.ok(fs.existsSync('./storage.db'));
  });

  it('should create data', () => {
    storage.create('foo', 'bar');
    assert.deepEqual(storage.engine.read(), { 'foo': 'bar' });
  });

  it('should read data', () => {
    assert.deepEqual(storage.read(), { 'foo': 'bar' });
  });

  it('should read specific data', () => {
    assert.equal(storage.read('foo'), 'bar');
  });

  it('should update data', () => {
    storage.update('foo', 'biz');
    assert.deepEqual(storage.engine.read(), { 'foo': 'biz' });
  });

  it('should delete data', () => {
    storage.create('bar', 'buzz');
    assert.deepEqual(storage.read(), { 'foo': 'biz', 'bar': 'buzz' }, 'Simple creation');
    storage.delete('bar');
    assert.deepEqual(storage.read(), { 'foo': 'biz' }, 'Delete operation');
  });
});
