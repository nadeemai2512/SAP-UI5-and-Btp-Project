const cds = require('@sap/cds');

module.exports = class ProductService extends cds.ApplicationService {
  init() {
    const { Products } = this.entities;

    this.before(['CREATE', 'UPDATE'], 'Products', (req) => {
      if (req.data.price !== undefined && req.data.price < 0) req.error(400, 'Price must not be negative', 'price');
      if (req.data.stock !== undefined && req.data.stock < 0) req.error(400, 'Stock must not be negative', 'stock');
    });

    this.on('restock', 'Products', async (req) => {
      const key = req.params[0];
      const ID = typeof key === 'object' ? key.ID : key;
      const amount = req.data.amount;
      if (!amount || amount <= 0) return req.error(400, 'Amount must be greater than 0');
      await UPDATE(Products, ID).with({ stock: { '+=': amount } });
      return SELECT.one.from(Products, ID);
    });

    return super.init();
  }
};
