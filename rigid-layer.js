'use strict';
const fs = require('fs');

function RigidLayer(opts={}) {
  this.filename = opts.filename || './rigid-layer.db';
  this.grid = [];
  this.cursor = 0;
}

RigidLayer.prototype.push = function () {
  let args = Array.from(arguments);
  args.forEach(v => this.grid.push(v));
  this.cursor += 1;
  return this;
};

RigidLayer.prototype.save = function () {
  fs.writeFileSync(this.filename, JSON.stringify(this.grid));
  return this;
};

RigidLayer.prototype.load = function () {
  this.grid = JSON.parse(fs.readFileSync(this.filename));
  return this;
};

RigidLayer.prototype.checkpoint = function () {
  fs.writeFileSync(this.filename.replace('.db', '.kpt'), JSON.stringify({
    cursor: this.cursor,
    blocks: this.grid.filter(v => typeof v === 'object').length,
  }));
  return this;
};

RigidLayer.prototype.readFromCursor = function (c=this.cursor) {
  return this.grid[c];
};

module.exports = RigidLayer;
