import AppDataSource from '../data-source';
import { Store } from '../entities/StoreEntity';

export async function seedStores() {
  const storeRepository = AppDataSource.getRepository(Store)

  const stores = [
    { name: 'Highlands Coffee LD', location: '2B Đ. Lê Duẩn, Quận 1' },
    { name: 'Highlands Coffee BVD', location: '182 Đ. Bến Vân Đồn, Quận 4'},
    { name: 'Highlands Coffee NVT', location: '88 Đ. Nguyễn Văn Trỗi, Quận Phú Nhuận'},
  ];

  const existingStores = await storeRepository.find();

  if (existingStores.length > 0) {
    console.log('Store table already has data, no need to add more.');
    return;
  }

  await storeRepository.save(stores);

  console.log('Seed has been inserted into the database');
}
