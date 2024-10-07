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
          url: 'http://localhost:3000/api',
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
          schemas: {
              RegisterDTO: {
                  type: 'object',
                  properties: {
                      name: { type: 'string' },
                      phone: { type: 'string' },
                      email: { type: 'string' },
                      password: { type: 'string' },
                  },
                  required: ['name', 'phone', 'email', 'password'],
              },
              LoginDTO: {
                  type: 'object',
                  properties: {
                      email: { type: 'string' },
                      password: { type: 'string' },
                  },
                  required: ['email', 'password'],
              },
              ForgotPasswordDTO: {
                  type: 'object',
                  properties: {
                      email: { type: 'string' },
                  },
                  required: ['email'],
              },
              VerifyOtpDTO: {
                  type: 'object',
                  properties: {
                      otp: { type: 'string' },
                  },
                  required: ['otp'],
              },
              ResetPasswordDTO: {
                  type: 'object',
                  properties: {
                      newPassword: { type: 'string' },
                      confirmPassword: { type: 'string' },
                  },
                  required: ['newPassword', 'confirmPassword'],
              },
          },
      },
      security: [
          {
              bearerAuth: [],
          },
      ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: any) => {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};