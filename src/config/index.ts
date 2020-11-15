import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();

const envFound = dotenv.config();
if (!envFound) {
    console.info('No .env file specified, falling back to defaults');
}

export default {
    env: process.env.NODE_ENV || 'production',
    port: process.env.PORT || 80,
}