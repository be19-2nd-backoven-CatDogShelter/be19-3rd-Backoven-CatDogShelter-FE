#!/usr/bin/env zsh
# Copies image files into the backend storage folder, sets permissions,
# generates an INSERT SQL file for adoptionPostFiles, and optionally runs it.
# Run: ./scripts/deploy_files_and_insert.sh

set -euo pipefail

# --- CONFIG ---
SRC_DIR_DEFAULT="/Users/haeone/Desktop/be19-2nd-backoven-petShelter"
DST_DIR="/Users/haeone/Desktop/stack/be19-2nd-backoven-petShelter/catdogshelter-file-uploads/adoption"
PATTERN="*.png"
SQL_OUT="$(pwd)/scripts/adoption_insert_generated.sql"

# --- HELPERS ---
function usage() {
  cat <<EOF
Usage: $0 [--src DIR] [--run-sql {mysql|postgres}] [--db-host HOST] [--db-port PORT] [--db-name NAME] [--db-user USER]

Options:
  --src DIR            Source folder containing image files (default: $SRC_DIR_DEFAULT)
  --run-sql TYPE       If provided, will attempt to execute generated SQL: 'mysql' or 'postgres'
  --db-host HOST       DB host (default: localhost)
  --db-port PORT       DB port (mysql:3306, postgres:5432)
  --db-name NAME       Database name
  --db-user USER       Database user
  --help               Show this help

Behavior:
  - Copies files matching $PATTERN from source dir to backend storage dir
  - Ensures the destination directory exists and sets file permissions to 644
  - Generates SQL at $SQL_OUT containing INSERTs for found files
  - Infers post_id from trailing digits in filename (e.g. dog11.png -> post_id 11). If none found post_id will be 0 and you must edit it.
  - If --run-sql is provided, the script will try to run the SQL using provided DB credentials.

NOTE: Running SQL requires the mysql or psql CLI to be installed and reachable from your PATH.
EOF
}

# --- ARG PARSE ---
SRC_DIR="$SRC_DIR_DEFAULT"
RUN_SQL=""
DB_HOST="localhost"
DB_PORT=""
DB_NAME=""
DB_USER=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --src)
      SRC_DIR="$2"; shift 2;;
    --run-sql)
      RUN_SQL="$2"; shift 2;;
    --db-host)
      DB_HOST="$2"; shift 2;;
    --db-port)
      DB_PORT="$2"; shift 2;;
    --db-name)
      DB_NAME="$2"; shift 2;;
    --db-user)
      DB_USER="$2"; shift 2;;
    --help)
      usage; exit 0;;
    *)
      echo "Unknown arg: $1"; usage; exit 1;;
  esac
done

if [[ -z "$DB_PORT" ]]; then
  if [[ "$RUN_SQL" == "mysql" ]]; then DB_PORT=3306; fi
  if [[ "$RUN_SQL" == "postgres" ]]; then DB_PORT=5432; fi
fi

# --- EXECUTE ---
echo "Source dir: $SRC_DIR"
echo "Destination dir: $DST_DIR"

if [[ ! -d "$SRC_DIR" ]]; then
  echo "Source directory does not exist: $SRC_DIR"
  exit 1
fi

mkdir -p "$DST_DIR"

# Copy files
echo "Copying files matching $PATTERN from $SRC_DIR -> $DST_DIR"
shopt -s nullglob 2>/dev/null || true
# Use rsync if available for reliable copy
if command -v rsync >/dev/null 2>&1; then
  rsync -av --include="$PATTERN" --exclude='*' "$SRC_DIR/" "$DST_DIR/"
else
  for f in "$SRC_DIR"/$PATTERN; do
    if [[ -f "$f" ]]; then
      cp -v "$f" "$DST_DIR/"
    fi
  done
fi

# Fix permissions
echo "Setting file permissions to 644"
chmod 644 "$DST_DIR"/* || true

# Generate SQL
echo "Generating SQL file: $SQL_OUT"

cat > "$SQL_OUT" <<'SQLHEADER'
-- Generated INSERTs for adoptionPostFiles
-- Edit post_id values if inference is incorrect. Timestamp uses NOW().
INSERT INTO adoptionPostFiles (file_rename, file_path, uploaded_at, post_id)
VALUES
SQLHEADER

first=true
for f in "$DST_DIR"/*; do
  if [[ -f "$f" ]]; then
    base=$(basename "$f")
    name_noext="${base%.*}"
    # extract trailing number as post_id if present
    num=$(echo "$name_noext" | grep -oE '[0-9]+$' || true)
    if [[ -n "$num" ]]; then
      post_id=$num
    else
      post_id=0
    fi

    # escape single quotes in path/filename
    esc_name=${base//"/\"}
    esc_path=${f//"/\"}

    if $first; then
      printf "('%s', '%s', NOW(), %s)\n" "$esc_name" "$esc_path" "$post_id" >> "$SQL_OUT"
      first=false
    else
      printf ",('%s', '%s', NOW(), %s)\n" "$esc_name" "$esc_path" "$post_id" >> "$SQL_OUT"
    fi
  fi
done

# Append semicolon
printf ";\n" >> "$SQL_OUT"

echo "SQL generated at: $SQL_OUT"

# Show sample of generated SQL
echo "--- sample ---"
head -n 20 "$SQL_OUT" || true

# Optionally run SQL
if [[ -n "$RUN_SQL" ]]; then
  if [[ -z "$DB_NAME" || -z "$DB_USER" ]]; then
    echo "To run SQL automatically, supply --db-name and --db-user (and DB password via env)."
    echo "Skipping automatic execution. You can run the SQL manually:"
    echo "  mysql -u <user> -p <db> < $SQL_OUT    # for MySQL"
    echo "  psql -U <user> -d <db> -f $SQL_OUT    # for Postgres"
    exit 0
  fi

  if [[ "$RUN_SQL" == "mysql" ]]; then
    echo "Running SQL with mysql client"
    if [[ -z "${MYSQL_PWD:-}" ]]; then
      echo "Set MYSQL_PWD environment variable with DB password or the client will prompt."
    fi
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" < "$SQL_OUT"
    echo "mysql exit code: $?"
  elif [[ "$RUN_SQL" == "postgres" ]]; then
    echo "Running SQL with psql client"
    if [[ -n "${PGPASSWORD:-}" ]]; then
      export PGPASSWORD="$PGPASSWORD"
    fi
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_OUT"
    echo "psql exit code: $?"
  else
    echo "Unknown run-sql type: $RUN_SQL"
  fi
fi

echo "Done. Review $SQL_OUT and adjust post_id values if needed before committing to DB."
