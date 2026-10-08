#!/bin/sh
set -eu

PGDATA="${PGDATA:-/var/lib/postgresql/data}"
PG_BIN="$(pg_config --bindir)"
DB_HOST="127.0.0.1"
DB_PORT="5432"
DB_USER="${DB_USER:-admin}"
DB_PASSWORD="${DB_PASSWORD:-motor-social-demo-db}"
DB_NAME="${DB_NAME:-motor_social_db}"
JWT_SECRET="${JWT_SECRET:-motor-social-demo-jwt-secret}"

export PGDATA DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME JWT_SECRET
mkdir -p "$PGDATA"
chown -R postgres:postgres "$PGDATA"

if [ ! -s "$PGDATA/PG_VERSION" ]; then
    if [ -n "$(find "$PGDATA" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
        echo "FATAL: PGDATA no está vacío pero no contiene una base inicializada: $PGDATA"
        exit 1
    fi
    echo ">>> Inicializando PostgreSQL en $PGDATA..."
    runuser -u postgres -- "$PG_BIN/initdb" -D "$PGDATA" --encoding=UTF8 --locale=C --auth-local=trust --auth-host=scram-sha-256
fi

echo ">>> Arrancando PostgreSQL..."
runuser -u postgres -- "$PG_BIN/pg_ctl" -D "$PGDATA" \
    -o "-h 127.0.0.1 -p $DB_PORT" -w start

apagar() {
    if [ -n "${APP_PID:-}" ]; then
        kill -TERM "$APP_PID" 2>/dev/null || true
        wait "$APP_PID" 2>/dev/null || true
    fi
    runuser -u postgres -- "$PG_BIN/pg_ctl" -D "$PGDATA" -m fast -w stop 2>/dev/null || true
}
trap apagar EXIT
trap 'exit 0' INT TERM

echo ">>> Configurando usuario y base de datos..."
runuser -u postgres -- "$PG_BIN/psql" -v ON_ERROR_STOP=1 -d postgres \
    --set=db_user="$DB_USER" --set=db_password="$DB_PASSWORD" --set=db_name="$DB_NAME" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_user', :'db_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user')
\gexec
SELECT format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_password')
\gexec
SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'db_name')
\gexec
SQL

echo ">>> Aplicando migraciones..."
npm run db:migrate

echo ">>> Insertando datos de prueba si la base está vacía..."
npm run db:seed

echo ">>> Arrancando Express en el puerto ${PORT:-3000}..."
set +e
"$@" &
APP_PID=$!
wait "$APP_PID"
APP_STATUS=$?
set -e
exit "$APP_STATUS"
