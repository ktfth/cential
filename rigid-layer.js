'use strict';
const fs = require('fs');

function RigidLayer(opts={}) {
  this.filename = opts.filename || './rigid-layer.db';
  this.grid = [];
}

RigidLayer.prototype.push = function () {
  let args = Array.from(arguments);
  args.forEach(v => this.grid.push(v));
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

module.exports = RigidLayer;
