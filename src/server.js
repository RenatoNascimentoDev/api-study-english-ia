import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config({ quiet: true });

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
    console.log('');
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🌱 MongoDB conectado');
        app.listen(PORT, () => console.log(`🚀 HTTP server running on http://localhost:${PORT}`));
    } catch (err) {
        console.error('Erro ao iniciar', err);
        process.exit(1);
    }
}

start();