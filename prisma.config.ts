import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';
import path from 'path';

// Charge explicitement le fichier .env depuis la racine
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL as string,
    },
});