import { Pool } from 'pg';
import { config as configDotenv } from 'dotenv';

configDotenv();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, 
//   },
// });
const pool = new Pool({
  host: 'localhost',
  port: '5432',
  database: 'grupos_db',
  user: 'postgres',
  password: 'Burgospg'
})


pool.connect()
  .then(() => {
    console.log(`✅ Conectado a PostgreSQL en Neon. Base de datos: ${process.env.DB_NAME}`);
  })
  .catch((err) => {
    console.error('❌ Error al conectar a PostgreSQL:', err);
  });

export default pool;
