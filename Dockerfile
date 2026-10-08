# syntax=docker/dockerfile:1

FROM php:8.3-cli-alpine AS vendor
RUN apk add --no-cache git unzip
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts --no-autoloader
COPY . ./
RUN composer dump-autoload --optimize --no-dev \
    && composer run-script post-autoload-dump

FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit
COPY . ./
RUN npm run build

FROM php:8.3-fpm-alpine AS app
WORKDIR /var/www/html
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY --from=vendor --chown=www-data:www-data /app /var/www/html
COPY --from=frontend --chown=www-data:www-data /app/public/build /var/www/html/public/build
COPY deploy/entrypoint.sh /usr/local/bin/foundation-entrypoint
RUN chmod 0755 /usr/local/bin/foundation-entrypoint \
    && mkdir -p storage/app/public storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && ln -sfn ../storage/app/public public/storage \
    && rm -f public/hot \
    && chown -R www-data:www-data storage bootstrap/cache
ENTRYPOINT ["foundation-entrypoint"]
CMD ["php-fpm", "-F"]

FROM nginx:stable-alpine AS nginx
WORKDIR /var/www/html
COPY --from=app /var/www/html/public /var/www/html/public
RUN mkdir -p /var/www/html/storage/app/public \
    && ln -sfn ../storage/app/public /var/www/html/public/storage
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
