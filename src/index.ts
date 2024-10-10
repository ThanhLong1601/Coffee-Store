import 'reflect-metadata';
import express from 'express';
import AppDataSource from './data-source';
import userRouter from './routes/UserRoutes';
import dotenv from 'dotenv';
import { setupSwagger } from './configs/swagger';
import { seedStores } from './seeds/storeSeed';
import storeRouter from './routes/StoreRoutes';

dotenv.config();

const app = express();
app.use(express.json());

setupSwagger(app);

app.use('/api/users', userRouter);
app.use('/api/stores', storeRouter); 

AppDataSource.initialize()
    .then(async () => {
        console.log('Kết nối cơ sở dữ liệu thành công!');

        await seedStores();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Không thể kết nối cơ sở dữ liệu:', error);
    });