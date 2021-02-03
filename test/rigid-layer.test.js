'use strict';
const fs = require('fs');
const assert = require('assert');

const RigidLayer = require('../rigid-layer');

describe('Rigid layer', () => {
  let rigidLayer;

  after(() => {
    fs.unlinkSync('./rigid-layer.db');
  });

  it('should instantiate', () => {
    rigidLayer = new RigidLayer();

    assert.ok(rigidLayer instanceof RigidLayer);
  });

  it('should have grid', () => {
    assert.deepEqual(rigidLayer.grid, []);
  });

  it('should push data through grid', () => {
    rigidLayer.push({ 'foo': 'bar' });
    assert.deepEqual(rigidLayer.grid, [{'foo': 'bar'}]);
  });

  it('should save data from grid', () => {
    rigidLayer.save();
    assert.deepEqual(JSON.parse(fs.readFileSync('./rigid-layer.db')), [{'foo':'bar'}]);
  });

  it('should load data from file', () => {
    rigidLayer.grid = [];
    rigidLayer.load();
    assert.deepEqual(rigidLayer.grid, [{'foo': 'bar'}]);
  });
});
