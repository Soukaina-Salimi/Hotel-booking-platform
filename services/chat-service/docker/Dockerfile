# Dockerfile pour chat-service - plus leger que les autres services,
# pas besoin de l'extension amqp tant qu'il ne publie/consomme pas d'evenements RabbitMQ.

FROM php:8.3-cli-alpine

RUN apk add --no-cache git curl libzip-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 8000

CMD ["sh", "-c", "composer install --no-interaction --prefer-dist && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"]
