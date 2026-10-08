// backend/database/poblar_demo.js
//
// Llena la base de datos con contenido de demostración: usuarios reales
// (con contraseña funcional vía bcrypt), coches, publicaciones, relaciones
// de seguimiento, likes y comentarios — para que la app se vea viva.
//
// ADITIVO Y SEGURO: solo hace INSERT. Nunca borra, ni modifica, ni toca una
// sola fila de lo que ya exista (tus 21 usuarios/11 coches reales de antes
// siguen intactos). Usa un dominio de email propio (@demo-motorsocial.com)
// para no poder chocar nunca con un email real ya existente.
//
// Uso:
//   npm run db:poblar-demo
//   (o dentro del contenedor ya construido: docker compose exec motor-app npm run db:poblar-demo)
//
// Contraseña de las 45 cuentas creadas: demo1234

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/db');

const DOMINIO_DEMO = '@demo-motorsocial.com';
const PASSWORD_DEMO = 'demo1234';
const N_USUARIOS = 45;

// --- Datos de partida para generar contenido variado ---
const NOMBRES_BASE = [
    'Carlos', 'Elena', 'Marc', 'Sara', 'Dani', 'Laura', 'Javier', 'Nuria', 'Pablo', 'Marta',
    'Alex', 'Cristina', 'Diego', 'Irene', 'Raul', 'Paula', 'Sergio', 'Ines', 'Victor', 'Lucia',
    'Adrian', 'Claudia', 'Ruben', 'Sofia', 'Hugo', 'Andrea', 'Manuel', 'Alba', 'Ivan', 'Rocio',
];
const TEMAS = ['Rally', 'Drift', 'Turbo', 'Track', 'Garage', 'Wheels', 'Motor', 'Racing', 'Classic', 'Tuning', 'Speed', 'JDM', 'Offroad', 'Circuit', 'GT'];

const COCHES_POOL = [
    ['BMW', 'M3'], ['Audi', 'RS4'], ['Mercedes-AMG', 'GT'], ['Volkswagen', 'Golf GTI'],
    ['Seat', 'Ibiza Cupra'], ['Toyota', 'Supra'], ['Mazda', 'MX-5'], ['Honda', 'Civic Type R'],
    ['Ford', 'Mustang'], ['Chevrolet', 'Camaro'], ['Subaru', 'Impreza WRX'], ['Mitsubishi', 'Lancer Evo'],
    ['Alfa Romeo', 'Giulia'], ['Renault', 'Megane RS'], ['Peugeot', '208 GTI'], ['Fiat', '500 Abarth'],
    ['Porsche', 'Cayman'], ['Nissan', '370Z'], ['Dodge', 'Challenger'], ['Mini', 'Cooper S'],
    ['Citroen', 'Saxo VTS'], ['Opel', 'Corsa GSI'], ['Volvo', 'C30'], ['Skoda', 'Fabia RS'],
];
const COLORES = ['Red', 'Black', 'White', 'Blue', 'Gray', 'Yellow', 'Green', 'Orange', 'Silver'];

const BIOS = [
    'A lifelong car enthusiast.', 'Weekends are for the open road.',
    'Restoring classics in my spare time.', 'JDM through and through.', 'Track days and coffee.',
    'Collecting miles and stories.', 'If it sounds good, it drives good.', 'Garage is always open.',
    '', '', '', // algunas bios vacías, para que no todo el mundo tenga una
];

const TEXTOS_PUBLICACION = [
    'Sunday drive with this travel companion 🏁',
    'Fresh out of the shop and running like new.',
    'A morning polish before today\'s meetup.',
    'Nothing beats the sound of this engine starting from cold.',
    'Anyone else coming to Saturday\'s meetup?',
    'Final touches before inspection day.',
    'Changed the wheels and it feels like a completely different car.',
    'Another year together, and I still love it.',
    'Mountain roads this weekend. A few snapshots.',
    'A little tune-up for next season.',
    'Found this vintage sign to match the car. Couldn\'t resist.',
    'Coffee + cars: the perfect Saturday morning combo.',
    'A new addition to the garage. More soon.',
    'Checking everything over before next month\'s long drive.',
];

const COMENTARIOS_POOL = [
    'That is awesome!', 'What a beast 🔥', 'How much horsepower?', 'Love the color',
    'Absolutely brilliant!', 'I want one just like it', 'Is it for sale?', 'Incredible finish',
    'Looks great like that', 'Great work on it', 'A rare kind of classic', 'Bet it sounds amazing',
];

// --- Utilidades ---
function aleatorio(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}
function enteroEntre(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function elegirVarios(lista, cantidad) {
    const copia = [...lista];
    const elegidos = [];
    cantidad = Math.min(cantidad, copia.length);
    for (let i = 0; i < cantidad; i++) {
        const idx = Math.floor(Math.random() * copia.length);
        elegidos.push(copia.splice(idx, 1)[0]);
    }
    return elegidos;
}

let contadorImagen = 1;
function urlImagen(categoria) {
    return `https://loremflickr.com/800/600/${categoria}/all?lock=${contadorImagen++}`;
}

// Construye un INSERT multi-fila parametrizado: sin dependencias nuevas,
// sin bucles de una petición por fila. RETURNING id opcional.
function insertMultiple(tabla, columnas, filas, conId = true) {
    const valoresSql = [];
    const params = [];
    let n = 1;
    for (const fila of filas) {
        valoresSql.push(`(${fila.map(() => `$${n++}`).join(', ')})`);
        params.push(...fila);
    }
    const sql = `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES ${valoresSql.join(', ')}` +
        (conId ? ' RETURNING id' : ' ON CONFLICT DO NOTHING');
    return { sql, params };
}

async function ejecutarInsert(tabla, columnas, filas, conId = true) {
    if (filas.length === 0) return [];
    const { sql, params } = insertMultiple(tabla, columnas, filas, conId);
    const result = await pool.query(sql, params);
    return conId ? result.rows.map(r => r.id) : [];
}

async function yaSePobló() {
    const result = await pool.query('SELECT 1 FROM usuarios WHERE email LIKE $1 LIMIT 1', [`%${DOMINIO_DEMO}`]);
    return result.rows.length > 0;
}

async function poblar() {
    if (await yaSePobló()) {
        console.log(`Users with the ${DOMINIO_DEMO} domain already exist; skipping to avoid duplicates.`);
        console.log('To seed again, delete those accounts manually first.');
        return;
    }

    console.log(`Creating ${N_USUARIOS} users...`);
    const hash = await bcrypt.hash(PASSWORD_DEMO, 10);
    const nombresUsados = new Set();
    const filasUsuarios = [];
    while (filasUsuarios.length < N_USUARIOS) {
        const nombre = `${aleatorio(NOMBRES_BASE)}_${aleatorio(TEMAS)}`;
        if (nombresUsados.has(nombre)) continue;
        nombresUsados.add(nombre);
        const email = `${nombre.toLowerCase()}${DOMINIO_DEMO}`;
        const bio = aleatorio(BIOS);
        filasUsuarios.push([nombre, email, hash, bio, urlImagen('portrait,person')]);
    }
    const idsUsuarios = await ejecutarInsert('usuarios', ['nombre', 'email', 'password', 'bio', 'avatar_url'], filasUsuarios);
    console.log(`✓ Created ${idsUsuarios.length} users`);

    console.log('Creating cars...');
    const filasCoches = [];
    const cochesPorUsuario = new Map(); // usuario_id -> [coche index en filasCoches]
    for (const uid of idsUsuarios) {
        const nCoches = enteroEntre(1, 3);
        const indices = [];
        for (let i = 0; i < nCoches; i++) {
            const [marca, modelo] = aleatorio(COCHES_POOL);
            indices.push(filasCoches.length);
            filasCoches.push([
                marca, modelo, enteroEntre(1990, 2025), uid,
                null, urlImagen(`car,${marca.toLowerCase().replace(/\s|-/g, '')}`),
                enteroEntre(90, 650), enteroEntre(0, 220000), aleatorio(COLORES),
            ]);
        }
        cochesPorUsuario.set(uid, indices);
    }
    const idsCoches = await ejecutarInsert(
        'coches',
        ['marca', 'modelo', 'año', 'propietario_id', 'descripcion', 'foto_url', 'potencia_cv', 'kilometraje', 'color'],
        filasCoches
    );
    console.log(`✓ Created ${idsCoches.length} cars`);

    console.log('Creating posts...');
    const filasPublicaciones = [];
    for (const uid of idsUsuarios) {
        const nPosts = enteroEntre(0, 3);
        const misCochesIdx = cochesPorUsuario.get(uid) || [];
        for (let i = 0; i < nPosts; i++) {
            const conImagen = Math.random() < 0.7;
            const conCoche = misCochesIdx.length > 0 && Math.random() < 0.6;
            const cocheId = conCoche ? idsCoches[aleatorio(misCochesIdx)] : null;
            filasPublicaciones.push([
                uid, cocheId, aleatorio(TEXTOS_PUBLICACION),
                conImagen ? urlImagen('car') : null,
            ]);
        }
    }
    const idsPublicaciones = await ejecutarInsert(
        'publicaciones', ['usuario_id', 'coche_id', 'texto', 'imagen_url'], filasPublicaciones
    );
    console.log(`✓ Created ${idsPublicaciones.length} posts`);

    console.log('Creating follows...');
    const paresSeguidores = new Set();
    const filasSeguidores = [];
    for (const uid of idsUsuarios) {
        const otros = idsUsuarios.filter(id => id !== uid);
        const aSeguir = elegirVarios(otros, enteroEntre(3, 10));
        for (const seguidoId of aSeguir) {
            const clave = `${uid}-${seguidoId}`;
            if (paresSeguidores.has(clave)) continue;
            paresSeguidores.add(clave);
            filasSeguidores.push([uid, seguidoId]);
        }
    }
    await ejecutarInsert('seguidores', ['seguidor_id', 'seguido_id'], filasSeguidores, false);
    console.log(`✓ Created ${filasSeguidores.length} follow relationships`);

    console.log('Creating car likes and comments...');
    const filasLikesCoches = [];
    const filasComentariosCoches = [];
    for (const cocheId of idsCoches) {
        const nLikes = enteroEntre(0, Math.min(25, idsUsuarios.length));
        for (const uid of elegirVarios(idsUsuarios, nLikes)) {
            filasLikesCoches.push([uid, cocheId]);
        }
        const nComentarios = enteroEntre(0, 5);
        for (const uid of elegirVarios(idsUsuarios, nComentarios)) {
            filasComentariosCoches.push([cocheId, uid, aleatorio(COMENTARIOS_POOL)]);
        }
    }
    await ejecutarInsert('me_gusta', ['usuario_id', 'coche_id'], filasLikesCoches, false);
    await ejecutarInsert('comentarios', ['coche_id', 'usuario_id', 'contenido'], filasComentariosCoches);
    console.log(`✓ Created ${filasLikesCoches.length} car likes and ${filasComentariosCoches.length} comments`);

    console.log('Creating post likes and comments...');
    const filasLikesPosts = [];
    const filasComentariosPosts = [];
    for (const postId of idsPublicaciones) {
        const nLikes = enteroEntre(0, Math.min(20, idsUsuarios.length));
        for (const uid of elegirVarios(idsUsuarios, nLikes)) {
            filasLikesPosts.push([uid, postId]);
        }
        const nComentarios = enteroEntre(0, 4);
        for (const uid of elegirVarios(idsUsuarios, nComentarios)) {
            filasComentariosPosts.push([postId, uid, aleatorio(COMENTARIOS_POOL)]);
        }
    }
    await ejecutarInsert('publicacion_likes', ['usuario_id', 'publicacion_id'], filasLikesPosts, false);
    await ejecutarInsert('publicacion_comentarios', ['publicacion_id', 'usuario_id', 'contenido'], filasComentariosPosts);
    console.log(`✓ Created ${filasLikesPosts.length} post likes and ${filasComentariosPosts.length} comments`);

    console.log('\nDone. New account password: demo1234 (email: <lowercase_name>@demo-motorsocial.com)');
}

async function main() {
    try {
        await poblar();
    } catch (err) {
        console.error('Error seeding the database:', err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    main();
}

module.exports = { poblar };
