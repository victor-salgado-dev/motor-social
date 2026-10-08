# Base de datos — migraciones

Sistema mínimo, sin dependencias nuevas: usa el mismo `pg` que ya usa el backend.

## Comandos

```
npm run db:migrate   # aplica las migraciones pendientes (seguro de repetir)
npm run db:seed      # SOLO en una base de datos vacía: crea 3 usuarios y 3 coches de demo
```

## Cómo funciona

- Cada fichero en `migrations/` es SQL plano, con prefijo numérico (`001_...`, `002_...`) que marca el orden.
- `migrate.js` crea (si no existe) una tabla `_migraciones` que registra qué ficheros ya se han aplicado, y se salta los que ya estén.
- Cada migración se ejecuta dentro de una transacción: si falla, se revierte entera y no se marca como aplicada.
- `001_schema_inicial.sql` usa `CREATE TABLE IF NOT EXISTS`, así que es seguro ejecutarlo tanto contra la base de datos real (donde las tablas ya existen con datos) como contra una vacía.

## Instalación nueva (base de datos vacía)

```
docker compose up -d motor-db
docker compose run --rm motor-app npm run db:migrate
docker compose run --rm motor-app npm run db:seed   # opcional
docker compose up -d --build
```

## Despliegue en Render (un solo contenedor)

Render debe crear un servicio **Web Service** usando el `Dockerfile` de la raíz del repositorio. La imagen inicia PostgreSQL en `127.0.0.1`, aplica las migraciones y ejecuta `db:seed` antes de iniciar Express. `DB_HOST` y `DB_PORT` se fuerzan a esos valores locales; no copies `DB_HOST=motor-db` de `.env` a Render.

Configura estas variables en el servicio:

- `DB_USER=admin`
- `DB_PASSWORD`: una contraseña propia y segura
- `DB_NAME=motor_social_db`
- `JWT_SECRET`: una clave aleatoria larga

Añade un **Persistent Disk** montado en `/var/lib/postgresql/data`. Sin ese disco, Render puede eliminar la base de datos al reemplazar el contenedor. El puerto web se obtiene de `PORT`, proporcionado por Render.

## Añadir una migración nueva (en fases futuras)

Crea `backend/database/migrations/002_lo-que-sea.sql` con el siguiente número, y `npm run db:migrate` la detectará y aplicará sola. No edites una migración ya aplicada en producción — si necesitas corregir algo, añade una migración nueva.
