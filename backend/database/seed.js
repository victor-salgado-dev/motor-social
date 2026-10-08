// Seed de demostración: diez cuentas, garajes y actividad social.
// Es idempotente para las cuentas demo y no modifica usuarios ajenos a ellas.

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/db');

const PASSWORD_DEMO = 'demo1234';
const BIOS = [
    'Rutas de montaña y coches ligeros.',
    'Restaurando clásicos pieza a pieza.',
    'JDM de día, garaje de noche.',
    'Kilómetros, curvas y café.',
    'Los domingos son para carretera.',
    'Fan de los motores atmosféricos.',
    'Track days y puesta a punto.',
    'Colecciono historias de carretera.',
    'Siempre buscando la próxima curva.',
    'Clásicos europeos con carácter.',
];
const COCHES = [
    { marca: 'Renault', modelo: '5 Turbo', anio: 1985, descripcion: 'Icono del rally de Grupo B.', potencia: 160, kilometraje: 84000, color: 'Rojo' },
    { marca: 'Porsche', modelo: '911 Carrera', anio: 1991, descripcion: 'Clasico refrigerado por aire, restaurado con mimo.', potencia: 250, kilometraje: 112000, color: 'Plata' },
    { marca: 'Nissan', modelo: 'Skyline GT-R', anio: 1999, descripcion: 'JDM con puesta a punto ligera.', potencia: 280, kilometraje: 97000, color: 'Azul' },
    { marca: 'BMW', modelo: 'M3 E46', anio: 2003, descripcion: 'Seis cilindros y traccion trasera.', potencia: 343, kilometraje: 128000, color: 'Negro' },
    { marca: 'Toyota', modelo: 'Supra', anio: 1998, descripcion: 'Un proyecto que lleva años en marcha.', potencia: 330, kilometraje: 105000, color: 'Blanco' },
    { marca: 'Mazda', modelo: 'MX-5', anio: 2016, descripcion: 'Ligero, sencillo y perfecto para curvas.', potencia: 160, kilometraje: 62000, color: 'Rojo' },
    { marca: 'Ford', modelo: 'Mustang GT', anio: 2018, descripcion: 'V8 para disfrutar sin prisas.', potencia: 450, kilometraje: 49000, color: 'Amarillo' },
    { marca: 'Subaru', modelo: 'Impreza WRX', anio: 2005, descripcion: 'Traccion total y sonido inconfundible.', potencia: 265, kilometraje: 138000, color: 'Azul' },
    { marca: 'Honda', modelo: 'Civic Type R', anio: 2020, descripcion: 'Chasis preciso para carretera y circuito.', potencia: 320, kilometraje: 38000, color: 'Blanco' },
    { marca: 'Alfa Romeo', modelo: 'Giulia', anio: 2019, descripcion: 'Diseno italiano y buen equilibrio.', potencia: 280, kilometraje: 57000, color: 'Verde' },
];
const TEXTOS = [
    'Primera ruta larga de la temporada. El coche se ha portado de diez.',
    'Unas horas de garaje y por fin vuelve a sonar como debe.',
    'La carretera secundaria sigue siendo el mejor plan del domingo.',
    'Pequenos cambios, grandes sensaciones al volante.',
    'Quedada de amigos y gasolina de la buena.',
    'Despues de tantos anos, todavia me giro a mirarlo al aparcar.',
    'Dia de circuito: aprendiendo en cada vuelta.',
    'Hoy tocaba dejarlo limpio antes de la proxima salida.',
    'Una parada para el cafe y otra foto para el recuerdo.',
    'Cada kilometro suma una historia nueva.',
];
const COMENTARIOS = [
    'Que buena pinta tiene ese coche.',
    'Me encanta esa combinacion de color.',
    'Ese modelo nunca pasa de moda.',
    'Tiene que sonar espectacular.',
    'Gran trabajo, se nota el cuidado.',
    'Me apunto a la proxima ruta.',
    'Que ganas de verlo en persona.',
    'Una joya para disfrutarla en carretera.',
    'Las llantas le quedan perfectas.',
    'Buen plan para el fin de semana.',
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
        [`Demo_${['Rally', 'Clasicos', 'JDM', 'Garage', 'Turbo', 'Roadster', 'V8', 'Racing', 'Track', 'Italiano'][index]}`, emailDemo(index), passwordHash, BIOS[index], AVATARES[index]]
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
            console.log('La base ya contiene usuarios no demo; no se modifica para evitar mezclar datos.');
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
        console.log('Datos de demo listos: 10 usuarios, 10 coches, 20 publicaciones y actividad social.');
        console.log(`Acceso demo: ${emailDemo(0)} / ${PASSWORD_DEMO}`);
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
        console.error('Error al insertar los datos de demo:', err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    main();
}

module.exports = { seed };
