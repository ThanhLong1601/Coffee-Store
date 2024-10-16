import { env } from 'process';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'Coffee Store API',
          version: '1.0.0',
          description: 'API Documentation for Coffee Store',
      },
      servers: [
        {
          url: `http://localhost:${env.APP_PORT}/api`,
        },
      ],
      components: {
          securitySchemes: {
              bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
              },
          },
      },
  },
  apis: ['./src/swagger/*.yaml'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: any) => {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};