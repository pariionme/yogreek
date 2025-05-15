-- Create user
CREATE USER yogreek WITH PASSWORD 'yogreek123' CREATEDB;

-- Create database
CREATE DATABASE yogreek_db OWNER yogreek;

-- Create schemas in postgres database
CREATE SCHEMA IF NOT EXISTS product_service;
CREATE SCHEMA IF NOT EXISTS user_service;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE yogreek_db TO yogreek;
GRANT ALL ON SCHEMA product_service TO yogreek;
GRANT ALL ON SCHEMA user_service TO yogreek;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA product_service TO yogreek;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA user_service TO yogreek;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA product_service TO yogreek;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA user_service TO yogreek;

-- Drop tables
DROP TABLE IF EXISTS products_order CASCADE;
DROP TABLE IF EXISTS products_productorder CASCADE;
DROP TABLE IF EXISTS products_product CASCADE;
DROP TABLE IF EXISTS products_customer CASCADE;
DROP TABLE IF EXISTS products_shipping CASCADE;
DROP TABLE IF EXISTS products_payment CASCADE; 