# Dockerfile type pour un microservice Laravel.
# A copier tel quel dans services/<nom-du-service>/docker/Dockerfile

FROM php:8.3-cli-alpine

# Extensions PHP necessaires a Laravel + MySQL + gestion des files RabbitMQ
RUN apk add --no-cache \
        git \
        curl \
        libzip-dev \
        oniguruma-dev \
        rabbitmq-c-dev \
        $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_mysql mbstring zip bcmath \
    && pecl install amqp \
    && docker-php-ext-enable amqp

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Le code source est monte en volume en dev (voir docker-compose.yml),
# donc pas de COPY ici pour eviter de dupliquer les fichiers en developpement.
# En production, decommenter la ligne suivante et retirer le volume du compose :
# COPY . /var/www/html

EXPOSE 8000

# Serveur de dev integre a Laravel (php artisan serve).
# En production, remplacer par php-fpm + nginx dedie au service.
CMD ["sh", "-c", "composer install --no-interaction --prefer-dist && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"]
