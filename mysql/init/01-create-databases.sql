-- Ce script s'execute automatiquement au premier demarrage du conteneur MySQL
-- (dossier docker-entrypoint-initdb.d). Cree une base dediee par microservice,
-- conformement au pattern Database-per-Service defini dans la conception.

CREATE DATABASE IF NOT EXISTS auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Un utilisateur applicatif unique en dev (a restreindre par service en production)
CREATE USER IF NOT EXISTS 'rh_app'@'%' IDENTIFIED BY 'rh_app_password';
GRANT ALL PRIVILEGES ON auth_db.* TO 'rh_app'@'%';
GRANT ALL PRIVILEGES ON hotel_db.* TO 'rh_app'@'%';
GRANT ALL PRIVILEGES ON booking_db.* TO 'rh_app'@'%';
GRANT ALL PRIVILEGES ON payment_db.* TO 'rh_app'@'%';
FLUSH PRIVILEGES;
