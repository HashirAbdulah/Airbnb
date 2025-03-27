#!/bin/bash

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
while ! nc -z $SQL_HOST $SQL_PORT; do
  sleep 0.1
done
echo "Database is ready!"

# Run migrations (if you want)
python manage.py makemigrations
python manage.py migrate

# Run the server
exec "$@"
