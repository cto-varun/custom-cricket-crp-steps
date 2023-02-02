"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class CheckAddonQty {
  constructor(qty) {
    this.qty = qty;
  }
  incrementQty() {
    if (this.qty < 9) this.qty += 1;
  }
  decrementQty() {
    if (this.qty !== 0) this.qty -= 1;
  }
  getQty() {
    return this.qty;
  }
  resetQty() {
    this.qty = 0;
  }
}
var _default = CheckAddonQty;
exports.default = _default;
module.exports = exports.default;