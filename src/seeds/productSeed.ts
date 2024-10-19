import AppDataSource from '../data-source';
import { Product } from '../entities/ProductEntity';
import { Store } from '../entities/StoreEntity';

export async function seedProducts() {
  const productRepository = AppDataSource.getRepository(Product);
  const storeRepository = AppDataSource.getRepository(Store);

  const products = [
    { image: 'https://example.com/image1.jpg', name: 'Americano', price: 300, storeId: 1 },
    { image: 'https://example.com/image2.jpg', name: 'Cappuccino', price: 500, storeId: 1 },
    { image: 'https://example.com/image3.jpg', name: 'Latte', price: 250, storeId: 1 },
    { image: 'https://example.com/image1.jpg', name: 'Flat White', price: 300, storeId: 1 },
    { image: 'https://example.com/image2.jpg', name: 'Raf', price: 300, storeId: 1 },
    { image: 'https://example.com/image3.jpg', name: 'Espresso', price: 250, storeId: 1 },
    { image: 'https://example.com/image3.jpg', name: 'Mocha', price: 200, storeId: 1 },
    { image: 'https://example.com/image1.jpg', name: 'Americano', price: 300, storeId: 2 },
    { image: 'https://example.com/image2.jpg', name: 'Cappuccino', price: 500, storeId: 2 },
    { image: 'https://example.com/image3.jpg', name: 'Latte', price: 250, storeId: 2 },
    { image: 'https://example.com/image1.jpg', name: 'Flat White', price: 300, storeId: 2 },
    { image: 'https://example.com/image2.jpg', name: 'Raf', price: 300, storeId: 2 },
    { image: 'https://example.com/image3.jpg', name: 'Espresso', price: 250, storeId: 2 },
    { image: 'https://example.com/image3.jpg', name: 'Egg coffee', price: 350, storeId: 2 },
    { image: 'https://example.com/image1.jpg', name: 'Americano', price: 300, storeId: 3 },
    { image: 'https://example.com/image2.jpg', name: 'Cappuccino', price: 500, storeId: 3 },
    { image: 'https://example.com/image3.jpg', name: 'Latte', price: 250, storeId: 3 },
    { image: 'https://example.com/image1.jpg', name: 'Flat White', price: 300, storeId: 3 },
    { image: 'https://example.com/image2.jpg', name: 'Raf', price: 300, storeId: 3 },
    { image: 'https://example.com/image3.jpg', name: 'Espresso', price: 250, storeId: 3 },
    { image: 'https://example.com/image3.jpg', name: 'Macchiato', price: 350, storeId: 3 },
  ];

  const existingProducts = await productRepository.find();

  if (existingProducts.length > 0) {
    console.log('Product table already has data, no need to add more.');
    return;
  }

  for (const productData of products) {
    const store = await storeRepository.findOneBy({ id: productData.storeId });
    
    if (store) {
      const product = productRepository.create({
        ...productData,
        store,
      });

      await productRepository.save(product);
    } else {
      console.error(`Store with ID ${productData.storeId} not found!`);
    }
  }

  console.log('Seed has been inserted into the database');
}