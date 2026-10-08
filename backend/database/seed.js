// Seed de demostración: diez cuentas, garajes y actividad social.
// Es idempotente para las cuentas demo y no modifica usuarios ajenos a ellas.

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/db');

const PASSWORD_DEMO = 'demo1234';
const BIOS = [
    'Mountain roads and lightweight cars.',
    'Restoring classics one part at a time.',
    'JDM by day, garage by night.',
    'Miles, corners, and coffee.',
    'Sundays are for the open road.',
    'A fan of naturally aspirated engines.',
    'Track days and fine-tuning.',
    'Collecting road-trip stories.',
    'Always looking for the next corner.',
    'European classics with character.',
];
const COCHES = [
    { marca: 'Renault', modelo: '5 Turbo', anio: 1985, descripcion: 'A Group B rally icon.', potencia: 160, kilometraje: 84000, color: 'Red' },
    { marca: 'Porsche', modelo: '911 Carrera', anio: 1991, descripcion: 'A lovingly restored air-cooled classic.', potencia: 250, kilometraje: 112000, color: 'Silver' },
    { marca: 'Nissan', modelo: 'Skyline GT-R', anio: 1999, descripcion: 'JDM with a few thoughtful upgrades.', potencia: 280, kilometraje: 97000, color: 'Blue' },
    { marca: 'BMW', modelo: 'M3 E46', anio: 2003, descripcion: 'A straight-six with rear-wheel drive.', potencia: 343, kilometraje: 128000, color: 'Black' },
    { marca: 'Toyota', modelo: 'Supra', anio: 1998, descripcion: 'A project that has been years in the making.', potencia: 330, kilometraje: 105000, color: 'White' },
    { marca: 'Mazda', modelo: 'MX-5', anio: 2016, descripcion: 'Lightweight, simple, and perfect for twisty roads.', potencia: 160, kilometraje: 62000, color: 'Red' },
    { marca: 'Ford', modelo: 'Mustang GT', anio: 2018, descripcion: 'A V8 to enjoy at your own pace.', potencia: 450, kilometraje: 49000, color: 'Yellow' },
    { marca: 'Subaru', modelo: 'Impreza WRX', anio: 2005, descripcion: 'All-wheel drive and unmistakable sound.', potencia: 265, kilometraje: 138000, color: 'Blue' },
    { marca: 'Honda', modelo: 'Civic Type R', anio: 2020, descripcion: 'A precise chassis for road and track.', potencia: 320, kilometraje: 38000, color: 'White' },
    { marca: 'Alfa Romeo', modelo: 'Giulia', anio: 2019, descripcion: 'Italian design and great balance.', potencia: 280, kilometraje: 57000, color: 'Green' },
];
const TEXTOS = [
    'First long drive of the season. The car was a dream.',
    'A few hours in the garage and it finally sounds right again.',
    'A quiet back road is still the best Sunday plan.',
    'Small changes, big difference behind the wheel.',
    'A meetup with friends and a proper fill-up.',
    'After all these years, I still turn around to look at it when I park.',
    'Track day: learning with every lap.',
    'Had to get it cleaned up before the next drive.',
    'A coffee stop and another photo to remember the day.',
    'Every mile adds a new story.',
];
const COMENTARIOS = [
    'That car looks great.',
    'Love that color combination.',
    'That model never goes out of style.',
    'It must sound incredible.',
    'Great work, the care really shows.',
    "Count me in for the next drive.",
    "Can't wait to see it in person.",
    'A gem made for the open road.',
    'Those wheels suit it perfectly.',
    'Sounds like a great weekend plan.',
];
const AVATARES = Array.from({ length: 10 }, (_, index) => `/demo/avatar-${String(index + 1).padStart(2, '0')}.jpg`);
const FOTOS_COCHE = Array.from({ length: 6 }, (_, index) => `/demo/car-${String(index + 1).padStart(2, '0')}.jpg`);

function emailDemo(index) {
    return `demo${index + 1}@motorsocial.local`;
}

async function obtenerOcrearUsuario(client, index, passwordHash) {
    const result = await client.query(
        `INSERT INTO usuarios (nombre, email, password, bio, avatar_url)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET bio = EXCLUDED.bio, avatar_url = EXCLUDED.avatar_url
         RETURNING id`,
        [`Demo_${['Rally', 'Classics', 'JDM', 'Garage', 'Turbo', 'Roadster', 'V8', 'Racing', 'Track', 'Italian'][index]}`, emailDemo(index), passwordHash, BIOS[index], AVATARES[index]]
    );
    return result.rows[0].id;
}

async function obtenerOCrearCoche(client, userId, index) {
    const coche = COCHES[index];
    const existente = await client.query(
        'SELECT id FROM coches WHERE propietario_id = $1 ORDER BY id LIMIT 1',
        [userId]
    );
    if (existente.rows.length) {
        const result = await client.query(
            `UPDATE coches SET marca = $1, modelo = $2, "año" = $3, descripcion = $4,
             foto_url = $5, potencia_cv = $6, kilometraje = $7, color = $8
             WHERE id = $9 RETURNING id`,
            [coche.marca, coche.modelo, coche.anio, coche.descripcion, FOTOS_COCHE[index % FOTOS_COCHE.length], coche.potencia, coche.kilometraje, coche.color, existente.rows[0].id]
        );
        return result.rows[0].id;
    }
    const result = await client.query(
        `INSERT INTO coches (marca, modelo, "año", propietario_id, descripcion, foto_url, potencia_cv, kilometraje, color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [coche.marca, coche.modelo, coche.anio, userId, coche.descripcion, FOTOS_COCHE[index % FOTOS_COCHE.length], coche.potencia, coche.kilometraje, coche.color]
    );
    return result.rows[0].id;
}

async function asegurarPublicaciones(client, userId, carId, index) {
    const existentes = await client.query(
        'SELECT id FROM publicaciones WHERE usuario_id = $1 ORDER BY id LIMIT 2',
        [userId]
    );
    const ids = existentes.rows.map(row => row.id);
    while (ids.length < 2) {
        const postNumber = index + ids.length;
        const result = await client.query(
            `INSERT INTO publicaciones (usuario_id, coche_id, texto, imagen_url)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [userId, carId, TEXTOS[postNumber % TEXTOS.length], FOTOS_COCHE[postNumber % FOTOS_COCHE.length]]
        );
        ids.push(result.rows[0].id);
    }
    return ids;
}

async function yaHayUsuariosNoDemo(client) {
    const result = await client.query(
        `SELECT COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE email LIKE 'demo%@motorsocial.local')::int AS demo
         FROM usuarios`
    );
    return result.rows[0].total > 0 && result.rows[0].demo === 0;
}

async function seed() {
    const client = await pool.connect();
    try {
        if (await yaHayUsuariosNoDemo(client)) {
            console.log('The database already contains non-demo users; leaving it unchanged to avoid mixing data.');
            return;
        }

        await client.query('BEGIN');
        const passwordHash = await bcrypt.hash(PASSWORD_DEMO, 10);
        const userIds = [];
        const carIds = [];
        const postIds = [];

        for (let index = 0; index < 10; index++) {
            const userId = await obtenerOcrearUsuario(client, index, passwordHash);
            userIds.push(userId);
            carIds.push(await obtenerOCrearCoche(client, userId, index));
        }
        for (let index = 0; index < 10; index++) {
            postIds.push(await asegurarPublicaciones(client, userIds[index], carIds[index], index));
        }

        for (let index = 0; index < 10; index++) {
            for (const salto of [1, 2, 3]) {
                const followerId = userIds[index];
                const followedIndex = (index + salto) % 10;
                const followedId = userIds[followedIndex];
                await client.query(
                    'INSERT INTO seguidores (seguidor_id, seguido_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [followerId, followedId]
                );
                await client.query(
                    `INSERT INTO notificaciones (usuario_id, actor_id, tipo)
                     SELECT $1, $2, 'nuevo_seguidor'
                     WHERE NOT EXISTS (SELECT 1 FROM notificaciones WHERE usuario_id = $1 AND actor_id = $2 AND tipo = 'nuevo_seguidor')`,
                    [followedId, followerId]
                );
            }
        }

        for (let index = 0; index < 10; index++) {
            for (const salto of [1, 2, 3]) {
                const actorId = userIds[index];
                const targetIndex = (index + salto) % 10;
                await client.query(
                    'INSERT INTO me_gusta (usuario_id, coche_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [actorId, carIds[targetIndex]]
                );
                await client.query(
                    'INSERT INTO publicacion_likes (usuario_id, publicacion_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [actorId, postIds[targetIndex][0]]
                );
            }
        }

        for (let index = 0; index < 10; index++) {
            const carComments = await client.query('SELECT 1 FROM comentarios WHERE coche_id = $1 LIMIT 1', [carIds[index]]);
            if (!carComments.rows.length) {
                for (const salto of [1, 2]) {
                    await client.query(
                        'INSERT INTO comentarios (coche_id, usuario_id, contenido) VALUES ($1, $2, $3)',
                        [carIds[index], userIds[(index + salto) % 10], COMENTARIOS[(index + salto) % COMENTARIOS.length]]
                    );
                }
            }
            for (const postId of postIds[index]) {
                const postComments = await client.query('SELECT 1 FROM publicacion_comentarios WHERE publicacion_id = $1 LIMIT 1', [postId]);
                if (!postComments.rows.length) {
                    for (const salto of [1, 2]) {
                        await client.query(
                            'INSERT INTO publicacion_comentarios (publicacion_id, usuario_id, contenido) VALUES ($1, $2, $3)',
                            [postId, userIds[(index + salto) % 10], COMENTARIOS[(index + salto + 2) % COMENTARIOS.length]]
                        );
                    }
                }
            }
        }

        await client.query('COMMIT');
        console.log('Demo data ready: 10 users, 10 cars, 20 posts, and social activity.');
        console.log(`Demo login: ${emailDemo(0)} / ${PASSWORD_DEMO}`);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function main() {
    try {
        await seed();
    } catch (err) {
        console.error('Error inserting demo data:', err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    main();
}

module.exports = { seed };
