import { Pool } from 'pg';
import { config as configDotenv } from 'dotenv';

configDotenv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log(`Conectado a PostgreSQL. Base de datos local: grupos_db`);
    client.release();
  } catch (err) {
    console.error('Error al conectar a PostgreSQL:', err);
  }
}

testConnection();



export default pool;
