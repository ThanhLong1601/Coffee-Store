import 'reflect-metadata';
import express from 'express';
import AppDataSource from './data-source';
import userRouter from './routes/UserRoutes';
import dotenv from 'dotenv';
import { setupSwagger } from './configs/swagger';
import { seedStores } from './seeds/storeSeed';
import storeRouter from './routes/StoreRoutes';
import { env } from 'process';
import { seedProducts } from './seeds/productSeed';
import productRouter from './routes/ProductRoutes';
import orderRouter from './routes/OrderRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.set('name', env.APP_NAME);
app.set('version', env.APP_VERSION);
app.set('port', env.APP_PORT);
app.set('env', env.APP_ENV);
app.set('host', env.APP_HOST);
app.set('db_name', env.DB_NAME);



setupSwagger(app);

app.use('/api/users', userRouter);
app.use('/api/stores', storeRouter); 
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);


AppDataSource.initialize()
    .then(async () => {
        await seedStores();
        await seedProducts();

        app.listen(app.get('port'), () => {
            console.info(`
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
- Name: ${app.get('name')}
- Version: ${app.get('version')}
- Environment: ${app.get('env')} 
- Host: ${app.get('host')}/api
- APIs Docs: ${app.get('host')}/swagger
- Database (MySQL): ${app.get('db_name')}
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
            `);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to database:', error);
        process.exit(1)
    });