class CheckAddonQty {
  constructor (qty) {
    this.qty = qty
  }

  incrementQty () {
    if (this.qty < 9) this.qty += 1;
  }

  decrementQty () {
    if (this.qty !== 0) this.qty -= 1;
  }

  getQty () {
    return this.qty;
  }

  resetQty () {
    this.qty = 0;
  }
}

export default CheckAddonQty;
