import "dotenv/config";
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    // Maintenant, process.env.DATABASE_URL sera correctement chargé
    url: process.env.DATABASE_URL,
  },
});