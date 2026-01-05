#!/bin/sh

# Wait for the database to be ready
echo "Waiting for postgres..."

while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done

echo "PostgreSQL started"

# Apply database migrations
python manage.py migrate

# Start server
exec "$@"
