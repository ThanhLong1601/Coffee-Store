import AppDataSource from '../data-source';
import { Product } from '../entities/ProductEntity';

export async function seedProducts() {
  const productRepository = AppDataSource.getRepository(Product);

  const products = [
    { image: 'https://example.com/image1.jpg', name: 'Americano', price: 300 },
    { image: 'https://example.com/image2.jpg', name: 'Cappuccino', price: 500 },
    { image: 'https://example.com/image3.jpg', name: 'Latte', price: 250 },
    { image: 'https://example.com/image1.jpg', name: 'Flat White', price: 300 },
    { image: 'https://example.com/image2.jpg', name: 'Raf', price: 300 },
    { image: 'https://example.com/image3.jpg', name: 'Espresso', price: 250 },
  ];

  const existingProducts = await productRepository.find();

  if (existingProducts.length > 0) {
    console.log('Product table already has data, no need to add more.');
    return;
  }

  await productRepository.save(products);

  console.log('Seed has been inserted into the database');
}