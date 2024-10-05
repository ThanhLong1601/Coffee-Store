import 'reflect-metadata';
import express from 'express';
import AppDataSource from './data-source';
import router from './routes/UserRoutes';
import dotenv from 'dotenv';
import { setupSwagger } from './configs/swagger';

dotenv.config();

const app = express();
app.use(express.json());

setupSwagger(app);

app.use('/api/users', router);

AppDataSource.initialize()
    .then(() => {
        console.log('Kết nối cơ sở dữ liệu thành công!');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Không thể kết nối cơ sở dữ liệu:', error);
    });