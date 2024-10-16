import AppDataSource from '../data-source';
import { Store } from '../entities/StoreEntity';

export async function seedStores() {
  const storeRepository = AppDataSource.getRepository(Store)

  const stores = [
    { name: 'Highlands Coffee LD', location: { latitude: 102.021214, longitude: 152.56854 } },
    { name: 'Highlands Coffee BVD', location: { latitude: 102.021614, longitude: 152.57854 }},
    { name: 'Highlands Coffee NVT', location: { latitude: 102.028214, longitude: 152.54854 }},
  ];

  const existingStores = await storeRepository.find();

  if (existingStores.length > 0) {
    console.log('Store table already has data, no need to add more.');
    return;
  }

  await storeRepository.save(stores);

  console.log('Seed has been inserted into the database');
}
