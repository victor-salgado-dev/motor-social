// backend/database/migrate.js
//
// Ejecutor de migraciones deliberadamente simple: sin dependencias nuevas,
// usa el mismo pool de PostgreSQL que ya usa el backend (backend/src/db.js).
//
// Lleva un registro de qué migraciones ya se han aplicado en la tabla
// _migraciones, así que se puede ejecutar tantas veces como haga falta
// (al desplegar, en local, etc.) sin repetir trabajo ni tocar datos
// existentes. Cada migración se aplica dentro de una transacción: si falla,
// se revierte entera.
//
// Uso:
//   npm run db:migrate
//   (o, dentro del contenedor ya construido: docker compose exec motor-app npm run db:migrate)

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function asegurarTablaControl() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS _migraciones (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) UNIQUE NOT NULL,
            aplicada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function migracionesAplicadas() {
    const result = await pool.query('SELECT nombre FROM _migraciones');
    return new Set(result.rows.map(r => r.nombre));
}

async function ejecutarMigraciones() {
    await asegurarTablaControl();
    const aplicadas = await migracionesAplicadas();

    if (!fs.existsSync(MIGRATIONS_DIR)) {
        console.log('No existe la carpeta de migraciones:', MIGRATIONS_DIR);
        return;
    }

    const ficheros = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort();

    if (ficheros.length === 0) {
        console.log('No hay ficheros .sql en', MIGRATIONS_DIR);
        return;
    }

    for (const fichero of ficheros) {
        if (aplicadas.has(fichero)) {
            console.log(`↷  ${fichero} — ya aplicada, se omite`);
            continue;
        }

        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, fichero), 'utf8');
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('INSERT INTO _migraciones (nombre) VALUES ($1)', [fichero]);
            await client.query('COMMIT');
            console.log(`✓  ${fichero} — aplicada correctamente`);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error(`✗  ${fichero} — ERROR, se ha revertido:`, err.message);
            throw err;
        } finally {
            client.release();
        }
    }
}

async function main() {
    try {
        await ejecutarMigraciones();
        console.log('Migraciones completadas.');
    } catch (err) {
        console.error('El proceso de migración se ha detenido por un error:', err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    main();
}

module.exports = { ejecutarMigraciones };
