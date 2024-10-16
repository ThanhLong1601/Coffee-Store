## Installation

- Node.js (v16 or higher)
- Mysql

## Install the dependencies:
- npm install

## Create a .env file in the root directory of the project and add the configuration information like .env.example file:

## Running the Project

==== Run the application in development mode:

- npm run dev

=== Or run the compiled application:

- npm start


==== To create sample data for the stores, run the following command:

- npm run seed:stores
- npm run seed:products

## Important Commands

==== Build the project:

- npm run build

==== To create the migrations, use the following command: Remember to fill in your information in '$___$'

- npm run migration:create src/migrations/$NameMigration$

==== To generate the migrations, use the following command:

- npm run migration:generate src/migrations/$NameMigration$

==== To run the migrations, use the following command:

- npm run migration:run

==== To show the migrations, use the following command:

- npm run migration:show

==== To revert the migrations, use the following command:

- npm run migration:revert


## Technologies Used

- TypeScript
- Express
- TypeORM
- MySQL
- Zod
- Swagger

## API Documentation

- The API documentation can be accessed at http://localhost:3000/swagger after running the application.