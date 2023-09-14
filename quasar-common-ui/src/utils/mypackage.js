export const MyPackage = {
  _package: null,
  _factor : 300,
  cubage  () {
    return this.quantity() * this.height() * this.width() * this.depth() * this._factor;
  },
  quantity() {
    if (this._package === null || this._package.qtd === null)
      return 0;

    return parseFloat(this._package.qtd.replace(',', '.'));
  },
  weight() {
    if (this._package === null || this._package.weight === null)
      return 0;

    return parseFloat(this._package.weight.replace(',', '.'));
  },
  height() {
    if (this._package === null || this._package.height === null)
      return 0;

    return parseFloat(this._package.height.replace(',', '.'));
  },
  width () {
    if (this._package === null || this._package.width === null)
      return 0;

    return parseFloat(this._package.width.replace(',', '.'));
  },
  depth () {
    if (this._package === null || this._package.depth === null)
      return 0;

    return parseFloat(this._package.depth.replace(',', '.'));
  },
  clean() {
    this._package = null;
  },

  canDelivery(auto) {
    switch (auto) {
      case 'motoboy':
        return this.height() <= 0.4 && this.width() <= 0.4 && this.depth() <= 0.4;
      break;
      case 'postal' :
      case 'aereo'  :
        return this.height() <= 1.0 && this.width() <= 1.0 && this.depth() <= 1.0;
      break;
      case 'fracion':
        return this.height() <= 3.0 && this.width() <= 3.0 && this.depth() <= 3.0;
      break;
    }

    return true;
  },
};
