'use strict';

function RigidLayer() {
  this.grid = [];
}

RigidLayer.prototype.push = function () {
  let args = Array.from(arguments);
  args.forEach(v => this.grid.push(v));
  return this;
};

module.exports = RigidLayer;
