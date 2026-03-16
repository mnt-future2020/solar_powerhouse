# Solar Power House

A comprehensive solar energy consultation and management platform built with Next.js and Node.js.

## Features

### Frontend (Next.js)
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Service Showcase**: Dynamic service listings with detailed pages
- **Consultation System**: Interactive consultation request forms with service selection
- **Admin Dashboard**: Complete management interface for services, consultations, and settings
- **SEO Management**: Page-specific SEO settings with live preview
- **Authentication**: Secure login/register system

### Backend (Node.js/Express)
- **RESTful API**: Complete API for all frontend operations
- **MongoDB Integration**: Robust data storage with Mongoose
- **Authentication**: JWT-based authentication system
- **File Upload**: Cloudinary integration for image management
- **Admin Panel**: Full CRUD operations for all entities

## Key Components

### Consultation System
- **Service Selection**: Dynamic dropdown with multiple service selection
- **Custom Alerts**: Beautiful success/error notifications
- **Admin Management**: View, update, and track consultation requests
- **Status Tracking**: New, Read, Replied status management

### Admin Features
- **Services Management**: Add, edit, delete services with image upload
- **Consultation Tracking**: View all consultation requests with service details
- **SEO Settings**: Page-specific meta tags, titles, and descriptions
- **General Settings**: Company information, contact details, business hours

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Upload)
- bcryptjs (Password Hashing)

## Installation

### Backend Setup
```bash
cd backend
npm install
# Create .env file with your MongoDB URI and other config
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with API URL
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Project Structure

```
├── backend/
│   ├── config/          # Configuration files
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js app router pages
│   │   ├── components/  # Reusable components
│   │   └── lib/         # Utility functions
│   └── public/          # Static assets
└── README.md
```

## Features Implemented

- ✅ Service management with image upload
- ✅ Consultation request system with service selection
- ✅ Admin dashboard with full CRUD operations
- ✅ SEO management with page-specific settings
- ✅ Authentication and authorization
- ✅ Responsive design for all devices
- ✅ Custom alert system for user feedback
- ✅ Status tracking for consultation requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.