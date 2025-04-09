# MERN Image Gallery Application

A full-stack application for image uploads and display, built with MongoDB, Express, React, and Node.js, prepared for production deployment.

## Features

- User authentication (register, login, logout)
- Image upload with title and description
- Image gallery on homepage visible to all users
- Personal dashboard to view and manage your uploaded images
- Responsive design with Tailwind CSS
- HTTPS with auto-renewing SSL certificates
- Production-ready deployment with Nginx as reverse proxy

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt with Certbot
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Development Setup

1. Clone the repository

```bash
git clone <repository-url>
cd mern-image-app
```

2. Start the development environment

```bash
docker-compose up
```

The development environment will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Deployment

1. Configure your domain

```bash
cp .env.example .env
```

Edit the `.env` file with your domain name and other configurations.

2. Initialize SSL certificates for your domain

```bash
./init-letsencrypt.sh
```

3. Start the production environment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Your application will be available at your domain with HTTPS!

## Project Structure

```
mern-image-app/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # Reusable components
│       ├── context/        # React context (auth)
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Page components
│       └── utils/          # Utility functions
├── server/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── uploads/            # Uploaded images
├── nginx/                  # Nginx configuration
│   └── conf.d/             # Nginx config files
└── docker-compose.yml      # Docker configuration
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get user data (requires token)

### Images

- `POST /api/images` - Upload a new image (requires token)
- `GET /api/images/all` - Get all images
- `GET /api/images/user` - Get user's images (requires token)
- `GET /api/images/:id` - Get a specific image
- `DELETE /api/images/:id` - Delete an image (requires token)

## Security

- Password hashing with bcrypt
- JWT for API authentication
- SSL/TLS encryption with Let's Encrypt
- File type validation for uploads
- Size limits on uploads (5MB)

## License

This project is licensed under the MIT License.