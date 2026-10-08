require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const pool = require('./db');

const app = express();

// --- VALIDACIÓN DE ARRANQUE ---
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is missing. The server cannot start securely.');
    process.exit(1);
}

// --- CONFIGURACIÓN DE FOTOS ---
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => {
        const unico = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
        cb(null, unico + path.extname(file.originalname));
    }
});

const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (TIPOS_IMAGEN_PERMITIDOS.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed. Only images (jpg, png, webp, gif) are accepted.'));
        }
    }
});

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET;

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, usuario) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.usuario = usuario;
        next();
    });
};

// Como autenticarToken, pero no rechaza si no hay token: lo usan los
// endpoints públicos que cambian de respuesta si sabes quién pregunta
// (p.ej. el perfil, para saber si el que mira ya sigue a ese usuario).
const autenticarOpcional = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) { req.usuario = null; return next(); }

    jwt.verify(token, SECRET_KEY, (err, usuario) => {
        req.usuario = err ? null : usuario;
        next();
    });
};

// --- RUTAS DE USUARIOS ---
app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: "Required fields are missing (name, email, password)" });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
            [nombre, email, hashed]
        );
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: "That email is already registered" });
        }
        console.error('Error in POST /usuarios:', err);
        res.status(500).json({ error: "Error registering user" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email or password is missing" });
        }
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });
        const valid = await bcrypt.compare(password, result.rows[0].password);
        if (!valid) return res.status(401).json({ error: "Incorrect password" });
        const token = jwt.sign({ id: result.rows[0].id, nombre: result.rows[0].nombre, avatar_url: result.rows[0].avatar_url }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.error('Error in /login:', err);
        res.status(500).json({ error: "Error logging in" });
    }
});

// --- RUTAS DE COCHES ---
app.get('/coches-detallados', async (req, res) => {
    try {
        const query = `
            SELECT coches.*, usuarios.nombre as nombre_propietario,
            (SELECT COUNT(*) FROM me_gusta WHERE coche_id = coches.id) as total_likes
            FROM coches 
            JOIN usuarios ON coches.propietario_id = usuarios.id
            ORDER BY coches.id DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in /coches-detallados:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/mis-coches', autenticarToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM coches WHERE propietario_id = $1 ORDER BY id DESC', [req.usuario.id]);
        res.json({ garaje: result.rows });
    } catch (err) {
        console.error('Error in /mis-coches:', err);
        res.status(500).json({ error: "Error loading garage" });
    }
});

app.post('/coches', autenticarToken, (req, res, next) => {
    upload.single('foto')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { marca, modelo, año, descripcion, potencia_cv, kilometraje, color } = req.body;
        if (!marca || !modelo) {
            return res.status(400).json({ error: "Make or model is missing" });
        }
        const foto_url = req.file ? `/uploads/${req.file.filename}` : null;
        const query = `INSERT INTO coches (marca, modelo, año, propietario_id, descripcion, foto_url, potencia_cv, kilometraje, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
        const result = await pool.query(query, [marca, modelo, año || null, req.usuario.id, descripcion, foto_url, potencia_cv || null, kilometraje || null, color || null]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in POST /coches:', err);
        res.status(500).json({ error: "Error saving car" });
    }
});

// --- NOTIFICACIONES ---
// No deja que un fallo al crear la notificación rompa la acción principal
// (el like, el comentario, el follow siguen funcionando aunque esto falle).
async function crearNotificacion(usuarioId, actorId, tipo, referenciaId = null) {
    if (String(usuarioId) === String(actorId)) return;
    try {
        await pool.query(
            'INSERT INTO notificaciones (usuario_id, actor_id, tipo, referencia_id) VALUES ($1, $2, $3, $4)',
            [usuarioId, actorId, tipo, referenciaId]
        );
    } catch (err) {
        console.error('Error creating notification:', err);
    }
}

// --- LIKES Y COMENTARIOS ---
app.post('/coches/:id/like', autenticarToken, async (req, res) => {
    try {
        const check = await pool.query('SELECT * FROM me_gusta WHERE usuario_id = $1 AND coche_id = $2', [req.usuario.id, req.params.id]);
        let liked = false;

        if (check.rows.length > 0) {
            await pool.query('DELETE FROM me_gusta WHERE usuario_id = $1 AND coche_id = $2', [req.usuario.id, req.params.id]);
            liked = false;
        } else {
            await pool.query('INSERT INTO me_gusta (usuario_id, coche_id) VALUES ($1, $2)', [req.usuario.id, req.params.id]);
            liked = true;
            const coche = await pool.query('SELECT propietario_id FROM coches WHERE id = $1', [req.params.id]);
            if (coche.rows.length > 0) {
                crearNotificacion(coche.rows[0].propietario_id, req.usuario.id, 'like_coche', req.params.id);
            }
        }

        res.json({ success: true, liked: liked });
    } catch (err) {
        console.error('Error in /like:', err);
        res.status(500).json({ error: "Error" });
    }
});

app.get('/coches/:id/comentarios', async (req, res) => {
    try {
        const query = `
            SELECT comentarios.*, usuarios.nombre as autor 
            FROM comentarios 
            JOIN usuarios ON comentarios.usuario_id = usuarios.id 
            WHERE coche_id = $1 ORDER BY fecha_registro ASC`;
        const result = await pool.query(query, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /comentarios:', err);
        res.status(500).json({ error: "Error loading comments" });
    }
});

app.post('/coches/:id/comentarios', autenticarToken, async (req, res) => {
    try {
        const { contenido } = req.body;
        if (!contenido || !contenido.trim()) {
            return res.status(400).json({ error: "Comment cannot be empty" });
        }
        const query = `INSERT INTO comentarios (coche_id, usuario_id, contenido) VALUES ($1, $2, $3) RETURNING *`;
        const result = await pool.query(query, [req.params.id, req.usuario.id, contenido]);

        const coche = await pool.query('SELECT propietario_id FROM coches WHERE id = $1', [req.params.id]);
        if (coche.rows.length > 0) {
            crearNotificacion(coche.rows[0].propietario_id, req.usuario.id, 'comentario_coche', req.params.id);
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in POST /comentarios:', err);
        res.status(500).json({ error: "Error saving comment" });
    }
});

// --- PERFIL DE USUARIO ---
app.get('/usuarios/:id', autenticarOpcional, async (req, res) => {
    try {
        const userResult = await pool.query(
            'SELECT id, nombre, bio, avatar_url, fecha_registro FROM usuarios WHERE id = $1',
            [req.params.id]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const statsResult = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM coches WHERE propietario_id = $1) AS total_coches,
                (SELECT COUNT(*) FROM me_gusta mg JOIN coches c ON mg.coche_id = c.id WHERE c.propietario_id = $1) AS total_likes_recibidos,
                (SELECT COUNT(*) FROM comentarios cm JOIN coches c ON cm.coche_id = c.id WHERE c.propietario_id = $1) AS total_comentarios_recibidos,
                (SELECT COUNT(*) FROM seguidores WHERE seguido_id = $1) AS total_seguidores,
                (SELECT COUNT(*) FROM seguidores WHERE seguidor_id = $1) AS total_seguidos
        `, [req.params.id]);

        let teSigue = false;
        if (req.usuario) {
            const followCheck = await pool.query(
                'SELECT 1 FROM seguidores WHERE seguidor_id = $1 AND seguido_id = $2',
                [req.usuario.id, req.params.id]
            );
            teSigue = followCheck.rows.length > 0;
        }

        res.json({ ...userResult.rows[0], ...statsResult.rows[0], le_sigues: teSigue });
    } catch (err) {
        console.error('Error in GET /usuarios/:id:', err);
        res.status(500).json({ error: "Error loading profile" });
    }
});

app.put('/perfil', autenticarToken, (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { nombre, bio } = req.body;
        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ error: "Name cannot be empty" });
        }
        const nuevoAvatar = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            `UPDATE usuarios 
             SET nombre = $1, bio = $2, avatar_url = COALESCE($3, avatar_url)
             WHERE id = $4 
             RETURNING id, nombre, email, bio, avatar_url`,
            [nombre, bio || null, nuevoAvatar, req.usuario.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in PUT /perfil:', err);
        res.status(500).json({ error: "Error updating profile" });
    }
});

// --- RED SOCIAL: seguir / dejar de seguir ---
app.post('/usuarios/:id/seguir', autenticarToken, async (req, res) => {
    try {
        if (String(req.usuario.id) === String(req.params.id)) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }
        const existeUsuario = await pool.query('SELECT 1 FROM usuarios WHERE id = $1', [req.params.id]);
        if (existeUsuario.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const check = await pool.query(
            'SELECT 1 FROM seguidores WHERE seguidor_id = $1 AND seguido_id = $2',
            [req.usuario.id, req.params.id]
        );

        let siguiendo;
        if (check.rows.length > 0) {
            await pool.query('DELETE FROM seguidores WHERE seguidor_id = $1 AND seguido_id = $2', [req.usuario.id, req.params.id]);
            siguiendo = false;
        } else {
            await pool.query('INSERT INTO seguidores (seguidor_id, seguido_id) VALUES ($1, $2)', [req.usuario.id, req.params.id]);
            siguiendo = true;
            crearNotificacion(req.params.id, req.usuario.id, 'seguidor');
        }
        res.json({ success: true, siguiendo });
    } catch (err) {
        console.error('Error in /seguir:', err);
        res.status(500).json({ error: "Error updating follow status" });
    }
});

app.get('/usuarios/:id/seguidores', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT usuarios.id, usuarios.nombre, usuarios.avatar_url
            FROM seguidores JOIN usuarios ON seguidores.seguidor_id = usuarios.id
            WHERE seguidores.seguido_id = $1
            ORDER BY usuarios.nombre`, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in /seguidores:', err);
        res.status(500).json({ error: "Error loading followers" });
    }
});

app.get('/usuarios/:id/seguidos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT usuarios.id, usuarios.nombre, usuarios.avatar_url
            FROM seguidores JOIN usuarios ON seguidores.seguido_id = usuarios.id
            WHERE seguidores.seguidor_id = $1
            ORDER BY usuarios.nombre`, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in /seguidos:', err);
        res.status(500).json({ error: "Error loading following list" });
    }
});

// Coches de los usuarios que sigues, más recientes primero (feed personalizado).
app.get('/feed-personalizado', autenticarToken, async (req, res) => {
    try {
        const query = `
            SELECT coches.*, usuarios.nombre as nombre_propietario,
            (SELECT COUNT(*) FROM me_gusta WHERE coche_id = coches.id) as total_likes
            FROM coches
            JOIN usuarios ON coches.propietario_id = usuarios.id
            WHERE coches.propietario_id IN (
                SELECT seguido_id FROM seguidores WHERE seguidor_id = $1
            )
            ORDER BY coches.id DESC`;
        const result = await pool.query(query, [req.usuario.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in /feed-personalizado:', err);
        res.status(500).json({ error: "Error loading feed" });
    }
});

// Comprueba si un coche existe y si pertenece al usuario dado.
async function verificarPropietarioCoche(cocheId, usuarioId) {
    const result = await pool.query('SELECT propietario_id FROM coches WHERE id = $1', [cocheId]);
    if (result.rows.length === 0) return { existe: false, esPropietario: false };
    return { existe: true, esPropietario: result.rows[0].propietario_id === usuarioId };
}

app.put('/coches/:id', autenticarToken, (req, res, next) => {
    upload.single('foto')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { existe, esPropietario } = await verificarPropietarioCoche(req.params.id, req.usuario.id);
        if (!existe) return res.status(404).json({ error: "Car not found" });
        if (!esPropietario) return res.status(403).json({ error: "You cannot edit someone else's car" });

        const { marca, modelo, año, descripcion, potencia_cv, kilometraje, color } = req.body;
        if (!marca || !modelo) {
            return res.status(400).json({ error: "Make or model is missing" });
        }
        const nuevaFoto = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            `UPDATE coches 
             SET marca = $1, modelo = $2, año = $3, descripcion = $4,
                 potencia_cv = $5, kilometraje = $6, color = $7,
                 foto_url = COALESCE($8, foto_url)
             WHERE id = $9
             RETURNING *`,
            [marca, modelo, año || null, descripcion, potencia_cv || null, kilometraje || null, color || null, nuevaFoto, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in PUT /coches/:id:', err);
        res.status(500).json({ error: "Error updating car" });
    }
});

app.delete('/coches/:id', autenticarToken, async (req, res) => {
    try {
        const { existe, esPropietario } = await verificarPropietarioCoche(req.params.id, req.usuario.id);
        if (!existe) return res.status(404).json({ error: "Car not found" });
        if (!esPropietario) return res.status(403).json({ error: "You cannot delete someone else's car" });

        await pool.query('DELETE FROM coches WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error in DELETE /coches/:id:', err);
        res.status(500).json({ error: "Error deleting car" });
    }
});

// --- GALERÍA DE FOTOS (además de la foto principal) ---
app.get('/coches/:id/fotos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM coche_fotos WHERE coche_id = $1 ORDER BY orden, id', [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /fotos:', err);
        res.status(500).json({ error: "Error loading photos" });
    }
});

app.post('/coches/:id/fotos', autenticarToken, (req, res, next) => {
    upload.single('foto')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { existe, esPropietario } = await verificarPropietarioCoche(req.params.id, req.usuario.id);
        if (!existe) return res.status(404).json({ error: "Car not found" });
        if (!esPropietario) return res.status(403).json({ error: "You cannot add photos to someone else's car" });
        if (!req.file) return res.status(400).json({ error: "No photo was received" });

        const foto_url = `/uploads/${req.file.filename}`;
        const result = await pool.query(
            'INSERT INTO coche_fotos (coche_id, foto_url) VALUES ($1, $2) RETURNING *',
            [req.params.id, foto_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in POST /coches/:id/fotos:', err);
        res.status(500).json({ error: "Error adding photo" });
    }
});

app.delete('/coches/:id/fotos/:fotoId', autenticarToken, async (req, res) => {
    try {
        const { existe, esPropietario } = await verificarPropietarioCoche(req.params.id, req.usuario.id);
        if (!existe) return res.status(404).json({ error: "Car not found" });
        if (!esPropietario) return res.status(403).json({ error: "You cannot delete photos from someone else's car" });

        await pool.query('DELETE FROM coche_fotos WHERE id = $1 AND coche_id = $2', [req.params.fotoId, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error in DELETE /fotos:', err);
        res.status(500).json({ error: "Error deleting photo" });
    }
});

// --- PUBLICACIONES ---
async function verificarPropietarioPublicacion(publicacionId, usuarioId) {
    const result = await pool.query('SELECT usuario_id FROM publicaciones WHERE id = $1', [publicacionId]);
    if (result.rows.length === 0) return { existe: false, esPropietario: false };
    return { existe: true, esPropietario: result.rows[0].usuario_id === usuarioId };
}

app.get('/publicaciones', async (req, res) => {
    try {
        const query = `
            SELECT publicaciones.*, 
                usuarios.nombre as nombre_autor, usuarios.avatar_url as avatar_autor,
                coches.marca as coche_marca, coches.modelo as coche_modelo,
                (SELECT COUNT(*) FROM publicacion_likes WHERE publicacion_id = publicaciones.id) as total_likes,
                (SELECT COUNT(*) FROM publicacion_comentarios WHERE publicacion_id = publicaciones.id) as total_comentarios
            FROM publicaciones
            JOIN usuarios ON publicaciones.usuario_id = usuarios.id
            LEFT JOIN coches ON publicaciones.coche_id = coches.id
            ORDER BY publicaciones.id DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /publicaciones:', err);
        res.status(500).json({ error: "Error loading posts" });
    }
});

app.post('/publicaciones', autenticarToken, (req, res, next) => {
    upload.single('imagen')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { texto, coche_id } = req.body;
        const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

        if ((!texto || !texto.trim()) && !imagen_url) {
            return res.status(400).json({ error: "A post needs text or an image" });
        }

        // Si se etiqueta un coche, comprobar que existe y que es tuyo.
        if (coche_id) {
            const { existe, esPropietario } = await verificarPropietarioCoche(coche_id, req.usuario.id);
            if (!existe) return res.status(400).json({ error: "The tagged car does not exist" });
            if (!esPropietario) return res.status(403).json({ error: "You can only tag cars from your own garage" });
        }

        const result = await pool.query(
            `INSERT INTO publicaciones (usuario_id, coche_id, texto, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.usuario.id, coche_id || null, texto || null, imagen_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in POST /publicaciones:', err);
        res.status(500).json({ error: "Error creating post" });
    }
});

app.put('/publicaciones/:id', autenticarToken, (req, res, next) => {
    upload.single('imagen')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { existe, esPropietario } = await verificarPropietarioPublicacion(req.params.id, req.usuario.id);
        if (!existe) return res.status(404).json({ error: "Post not found" });
        if (!esPropietario) return res.status(403).json({ error: "You cannot edit someone else's post" });

        const { texto, coche_id } = req.body;
        const nuevaImagen = req.file ? `/uploads/${req.file.filename}` : null;

        if (coche_id) {
            const check = await verificarPropietarioCoche(coche_id, req.usuario.id);
            if (!check.existe) return res.status(400).json({ error: "The tagged car does not exist" });
            if (!check.esPropietario) return res.status(403).json({ error: "You can only tag cars from your own garage" });
        }

        const result = await pool.query(
            `UPDATE publicaciones 
             SET texto = $1, coche_id = $2, imagen_url = COALESCE($3, imagen_url)
             WHERE id = $4
             RETURNING *`,
            [texto || null, coche_id || null, nuevaImagen, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in PUT /publicaciones/:id:', err);
        res.status(500).json({ error: "Error updating post" });
    }
});

app.delete('/publicaciones/:id', autenticarToken, async (req, res) => {
    try {
        const { existe, esPropietario } = await verificarPropietarioPublicacion(req.params.id, req.usuario.id);
        if (!existe) return res.status(404).json({ error: "Post not found" });
        if (!esPropietario) return res.status(403).json({ error: "You cannot delete someone else's post" });

        await pool.query('DELETE FROM publicaciones WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error in DELETE /publicaciones/:id:', err);
        res.status(500).json({ error: "Error deleting post" });
    }
});

app.post('/publicaciones/:id/like', autenticarToken, async (req, res) => {
    try {
        const check = await pool.query('SELECT 1 FROM publicacion_likes WHERE usuario_id = $1 AND publicacion_id = $2', [req.usuario.id, req.params.id]);
        let liked;
        if (check.rows.length > 0) {
            await pool.query('DELETE FROM publicacion_likes WHERE usuario_id = $1 AND publicacion_id = $2', [req.usuario.id, req.params.id]);
            liked = false;
        } else {
            await pool.query('INSERT INTO publicacion_likes (usuario_id, publicacion_id) VALUES ($1, $2)', [req.usuario.id, req.params.id]);
            liked = true;
            const publicacion = await pool.query('SELECT usuario_id FROM publicaciones WHERE id = $1', [req.params.id]);
            if (publicacion.rows.length > 0) {
                crearNotificacion(publicacion.rows[0].usuario_id, req.usuario.id, 'like_publicacion', req.params.id);
            }
        }
        res.json({ success: true, liked });
    } catch (err) {
        console.error('Error in /publicaciones/:id/like:', err);
        res.status(500).json({ error: "Error" });
    }
});

app.get('/publicaciones/:id/comentarios', async (req, res) => {
    try {
        const query = `
            SELECT publicacion_comentarios.*, usuarios.nombre as autor
            FROM publicacion_comentarios
            JOIN usuarios ON publicacion_comentarios.usuario_id = usuarios.id
            WHERE publicacion_id = $1 ORDER BY fecha_registro ASC`;
        const result = await pool.query(query, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /publicaciones/:id/comentarios:', err);
        res.status(500).json({ error: "Error loading comments" });
    }
});

app.post('/publicaciones/:id/comentarios', autenticarToken, async (req, res) => {
    try {
        const { contenido } = req.body;
        if (!contenido || !contenido.trim()) {
            return res.status(400).json({ error: "Comment cannot be empty" });
        }
        const result = await pool.query(
            `INSERT INTO publicacion_comentarios (publicacion_id, usuario_id, contenido) VALUES ($1, $2, $3) RETURNING *`,
            [req.params.id, req.usuario.id, contenido]
        );

        const publicacion = await pool.query('SELECT usuario_id FROM publicaciones WHERE id = $1', [req.params.id]);
        if (publicacion.rows.length > 0) {
            crearNotificacion(publicacion.rows[0].usuario_id, req.usuario.id, 'comentario_publicacion', req.params.id);
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in POST /publicaciones/:id/comentarios:', err);
        res.status(500).json({ error: "Error saving comment" });
    }
});

// --- PANEL DE NOTIFICACIONES ---
app.get('/notificaciones', autenticarToken, async (req, res) => {
    try {
        const query = `
            SELECT notificaciones.*, usuarios.nombre as nombre_actor, usuarios.avatar_url as avatar_actor
            FROM notificaciones
            JOIN usuarios ON notificaciones.actor_id = usuarios.id
            WHERE notificaciones.usuario_id = $1
            ORDER BY notificaciones.id DESC
            LIMIT 50`;
        const result = await pool.query(query, [req.usuario.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /notificaciones:', err);
        res.status(500).json({ error: "Error loading notifications" });
    }
});

app.get('/notificaciones/contador', autenticarToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(*) FROM notificaciones WHERE usuario_id = $1 AND leida = FALSE',
            [req.usuario.id]
        );
        res.json({ no_leidas: parseInt(result.rows[0].count, 10) });
    } catch (err) {
        console.error('Error in /notificaciones/contador:', err);
        res.status(500).json({ error: "Error loading notification count" });
    }
});

app.post('/notificaciones/marcar-leidas', autenticarToken, async (req, res) => {
    try {
        await pool.query('UPDATE notificaciones SET leida = TRUE WHERE usuario_id = $1 AND leida = FALSE', [req.usuario.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error in /notificaciones/marcar-leidas:', err);
        res.status(500).json({ error: "Error marking notifications as read" });
    }
});

// --- BÚSQUEDA Y DESCUBRIMIENTO ---
app.get('/buscar', async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) return res.json({ usuarios: [], coches: [], publicaciones: [] });
        const like = `%${q}%`;

        const [usuarios, coches, publicaciones] = await Promise.all([
            pool.query('SELECT id, nombre, avatar_url FROM usuarios WHERE nombre ILIKE $1 ORDER BY nombre LIMIT 8', [like]),
            pool.query(`
                SELECT coches.*, usuarios.nombre as nombre_propietario,
                (SELECT COUNT(*) FROM me_gusta WHERE coche_id = coches.id) as total_likes
                FROM coches JOIN usuarios ON coches.propietario_id = usuarios.id
                WHERE marca ILIKE $1 OR modelo ILIKE $1
                ORDER BY coches.id DESC LIMIT 8`, [like]),
            pool.query(`
                SELECT publicaciones.*, usuarios.nombre as nombre_autor, usuarios.avatar_url as avatar_autor,
                coches.marca as coche_marca, coches.modelo as coche_modelo
                FROM publicaciones 
                JOIN usuarios ON publicaciones.usuario_id = usuarios.id
                LEFT JOIN coches ON publicaciones.coche_id = coches.id
                WHERE texto ILIKE $1
                ORDER BY publicaciones.id DESC LIMIT 8`, [like])
        ]);

        res.json({ usuarios: usuarios.rows, coches: coches.rows, publicaciones: publicaciones.rows });
    } catch (err) {
        console.error('Error in /buscar:', err);
        res.status(500).json({ error: "Error searching" });
    }
});

app.get('/descubrir', async (req, res) => {
    try {
        const [perfiles, coches] = await Promise.all([
            pool.query(`
                SELECT usuarios.id, usuarios.nombre, usuarios.avatar_url, usuarios.bio,
                (SELECT COUNT(*) FROM seguidores WHERE seguido_id = usuarios.id) as total_seguidores
                FROM usuarios
                ORDER BY total_seguidores DESC, usuarios.id DESC LIMIT 6`),
            pool.query(`
                SELECT coches.*, usuarios.nombre as nombre_propietario,
                (SELECT COUNT(*) FROM me_gusta WHERE coche_id = coches.id) as total_likes
                FROM coches JOIN usuarios ON coches.propietario_id = usuarios.id
                ORDER BY total_likes DESC, coches.id DESC LIMIT 6`)
        ]);
        res.json({ perfiles_destacados: perfiles.rows, coches_destacados: coches.rows });
    } catch (err) {
        console.error('Error in /descubrir:', err);
        res.status(500).json({ error: "Error loading discovery page" });
    }
});

// --- RED DE SEGURIDAD: manejador global de errores ---
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
