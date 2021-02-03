'use strict';
const assert = require('assert');

const RigidLayer = require('../rigid-layer');

describe('Rigid layer', () => {
  let rigidLayer;

  it('should instantiate', () => {
    rigidLayer = new RigidLayer();

    assert.ok(rigidLayer instanceof RigidLayer);
  });

  it('should have grid', () => {
    assert.deepEqual(rigidLayer.grid, []);
  });
});
