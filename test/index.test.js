'use strict';
const assert = require('assert');

const { store, Engine } = require('../');

describe('Engine', () => {
  it('should store data', () => {
    assert.deepEqual(store.call({ root: {} }, 'foo', 'bar'), { 'foo': 'bar' }, 'Store engine structure');
  });

  it('should setup the instance', () => {
    assert.ok((new Engine()) instanceof Engine, 'Engine instantiation');
  });
});
