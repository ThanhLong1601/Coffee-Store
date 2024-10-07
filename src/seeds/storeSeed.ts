import AppDataSource from '../data-source';
import { store } from '../entities/StoreEntity';

export async function seedStores() {
  const storeRepository = AppDataSource.getRepository(store)

  const stores = [
    { name: 'Highlands Coffee LD', location: '2B Đ. Lê Duẩn, Quận 1' },
    { name: 'Highlands Coffee BVD', location: '182 Đ. Bến Vân Đồn, Quận 4'},
    { name: 'Highlands Coffee NVT', location: '88 Đ. Nguyễn Văn Trỗi, Quận Phú Nhuận'},
  ];

  const existingStores = await storeRepository.find();

  if (existingStores.length > 0) {
    console.log('Bảng store đã có dữ liệu, không cần thêm.');
    return;
  }

  await storeRepository.save(stores);

  console.log('Seed data for stores has been added');
}
