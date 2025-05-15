-- Connect to yogreek_db
\connect yogreek_db;

-- Create schemas with authorization
CREATE SCHEMA IF NOT EXISTS product_service AUTHORIZATION yogreek;
CREATE SCHEMA IF NOT EXISTS user_service AUTHORIZATION yogreek;
CREATE SCHEMA IF NOT EXISTS orders AUTHORIZATION yogreek;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE yogreek_db TO yogreek;
GRANT ALL ON SCHEMA product_service TO yogreek;
GRANT ALL ON SCHEMA user_service TO yogreek;
GRANT ALL ON SCHEMA orders TO yogreek;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA product_service TO yogreek;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA user_service TO yogreek;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA orders TO yogreek;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA product_service TO yogreek;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA user_service TO yogreek;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA orders TO yogreek;

\dn  -- แสดง schemas ทั้งหมด
\dt orders.*  -- แสดงตารางใน orders schema 