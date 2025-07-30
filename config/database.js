import { Pool } from 'pg';
import { config as configDotenv } from 'dotenv';

configDotenv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

(async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ Conectado a PostgreSQL en Neon. Base de datos: ${process.env.DB_NAME}`);
    client.release(); // 🔑 Muy importante
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err);
  }
})();


export default pool;
