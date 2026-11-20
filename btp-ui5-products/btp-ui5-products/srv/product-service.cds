using com.demo.products as db from '../db/schema';

@path: 'product'
service ProductService {
  entity Products as projection on db.Products
    actions {
      action restock(amount : Integer) returns Products;
    };
}
