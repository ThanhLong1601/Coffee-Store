import AppDataSource from '../data-source';
import { Product } from '../entities/ProductEntity';

export async function seedProducts() {
  const productRepository = AppDataSource.getRepository(Product);

  const products = [
    { image: 'https://example.com/image1.jpg', product_name: 'Americano', price: 3.00 },
    { image: 'https://example.com/image2.jpg', product_name: 'Cappuccino', price: 2.50 },
    { image: 'https://example.com/image3.jpg', product_name: 'Latte', price: 2.50 },
    { image: 'https://example.com/image1.jpg', product_name: 'Flat White', price: 3.00 },
    { image: 'https://example.com/image2.jpg', product_name: 'Raf', price: 3.00 },
    { image: 'https://example.com/image3.jpg', product_name: 'Espresso', price: 2.50 },
  ];

  const existingProducts = await productRepository.find();

  if (existingProducts.length > 0) {
    console.log('Product table already has data, no need to add more.');
    return;
  }

  await productRepository.save(products);

  console.log('Seed has been inserted into the database');
}