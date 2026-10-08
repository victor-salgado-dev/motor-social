const { Pool } = require('pg');

// Usaremos variables de entorno que definiremos en Docker
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Sin esto, un error en un cliente inactivo del pool (p.ej. la conexión
// se cae un instante) puede tumbar todo el proceso de Node.
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

module.exports = pool;