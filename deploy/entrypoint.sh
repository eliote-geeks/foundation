#!/usr/bin/env sh
set -eu

mkdir -p \
    storage/app/public \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

touch storage/database.sqlite
chown -R www-data:www-data storage bootstrap/cache
php artisan storage:link >/dev/null 2>&1 || true
php artisan migrate --force
php artisan optimize:clear >/dev/null
php artisan optimize

exec "$@"
