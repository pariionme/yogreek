# Yogreek E-commerce Platform

### Project Overview
Yogreek is a modern e-commerce platform built with microservices architecture. The project consists of a Next.js frontend and multiple backend services.

### Project Structure
```
yogreek-main/
├── ecommerce/              # Backend services
│   ├── user_service/      # User management service
│   ├── product_service/   # Product management service
│   ├── nginx.conf        # Nginx configuration
│   └── init_db.sql       # Database initialization
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   ├── public/           # Static assets
│   ├── services/         # API services
│   └── types/            # TypeScript type definitions
└── docker-compose.yml    # Docker compose configuration
```

### Technology Stack
- **Frontend**: Next.js, TypeScript , Tailwind CSS
- **Backend**: Microservices architecture
- **Database**: PostgreSQL (with initialization scripts)
- **Containerization**: Docker
- **Web Server**: Nginx

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn

### Getting Started
1. Clone the repository
```bash
git clone https://github.com/fay8451/yogreek.git
cd yogreek-main
```

2. Build and start the services using Docker Compose
```bash
docker-compose up --build -d
```

3. Set up the database and create superusers
```bash
# Product Service Setup
docker-compose exec product_service python manage.py makemigrations
docker-compose exec product_service python manage.py migrate
docker-compose exec product_service python manage.py createsuperuser

# User Service Setup (still not perfect)
docker-compose exec user_service python manage.py makemigrations
docker-compose exec user_service python manage.py migrate
docker-compose exec user_service python manage.py createsuperuser
```

4. Configure Nginx
```bash
# Run Nginx with the provided configuration
nginx -c /Users/sgot/Downloads/yogreek-main/ecommerce/nginx.conf
```

5. For frontend development
```bash
cd frontend
npm install
npm run dev
```

### Development with nginx
- Frontend runs on `http://localhost/` ; `http://localhost:3000`
- Admin interfaces:
  - System management: `http://localhost/admin/`
  - User management: `http://localhost/user_admin/users/user/` *** still not perfect
  - Product management: `http://localhost/admin/products/product/`
  - Payment management: `http://localhost/admin/products/payment/`
  - Product Order management: `http://localhost/admin/products/productorder/`
  - Shipping management: `http://localhost/admin/products/shipping/`
- API endpoints:
  - Product API: `http://localhost/api/products/`
  - User API: `http://localhost/api/users/` *** still not perfect
  - Order API: `http://localhost/api/orders/`
  - Product Order: `http://localhost/api/product-orders/`
<<<<<<< HEAD
- Backend services are accessible through the configured ports in docker-compose.yml
=======
- Backend services are accessible through the configured ports in docker-compose.yml
>>>>>>> 28544d7249bb4c0518114151c31bd4929e436bda
