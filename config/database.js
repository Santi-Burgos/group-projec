import { Pool } from 'pg';
import { config as configDotenv } from 'dotenv';

configDotenv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL completa desde Neon
  ssl: {
    rejectUnauthorized: false, // necesario para conexión segura en Neon
  },
});

pool.connect()
  .then(() => console.log('Conexión a PostgreSQL realizada con éxito'))
  .catch((err) => console.error('No se pudo conectar a PostgreSQL', err));

export default pool;
