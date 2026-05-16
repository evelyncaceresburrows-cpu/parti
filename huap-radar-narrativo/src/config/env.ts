import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  SUPABASE_URL: process.env.SUPABASE_URL ?? 'mock-supabase-url',
  SUPABASE_KEY: process.env.SUPABASE_KEY ?? 'mock-supabase-key'
};
