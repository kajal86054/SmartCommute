# SmartCommute - Carpool for Long Rides

A comprehensive trust-based carpooling platform for long-distance travel built with Node.js, Express, MongoDB, and React.

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- User profiles with trust scoring system
- Email and phone verification ready (currently simplified)

### Ride Management System
- **Post Rides**: Drivers can create ride offers with detailed information
- **Search Rides**: Passengers can find rides with advanced filtering
- **Join Rides**: Easy ride joining with seat management
- **My Rides**: Track posted rides and joined rides separately
- **Real-time Updates**: Automatic seat availability updates

### Advanced Features
- Trust scoring system for building community confidence
- Vehicle information management
- Ride preferences (smoking, pets, music, chatting)
- Responsive design for all devices
- Modern React UI with toast notifications

## 📁 Project Structure

```
smartcommute/
├── backend/                 # Node.js Express API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication & validation
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API routes
│   ├── uploads/           # File upload storage
│   └── server.js          # Main server file
│
└── frontend/               # React frontend
    ├── public/            # Static files
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── services/      # API services & context
    │   └── styles/        # CSS files
    └── package.json
```

## 🛠️ Quick Setup

### Prerequisites
- Node.js 18+ with npm
- MongoDB Atlas account (free tier)
- Git (optional)

### 1. Backend Setup
```bash
cd smartcommute/backend
npm install
# Copy .env.example to .env and add your MongoDB URI
npm run dev
```

### 2. Frontend Setup
```bash
cd smartcommute/frontend
npm install
npm start
```

### 3. MongoDB Atlas Setup
1. Create account at https://mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string and add to backend/.env

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
GET  /api/auth/me         # Get current user (protected)
POST /api/auth/logout     # Logout user (protected)
```

### Ride Management Endpoints
```
POST   /api/rides              # Create new ride (protected)
GET    /api/rides              # Search rides with filters
GET    /api/rides/my           # Get rides posted by current user (protected)
GET    /api/rides/joined       # Get rides joined by current user (protected)
GET    /api/rides/:id          # Get specific ride details
POST   /api/rides/:id/join     # Join a ride as passenger (protected)
DELETE /api/rides/:id/leave    # Leave a ride (protected)
```

### Query Parameters for Ride Search
```
?origin=Mumbai              # Filter by origin city
&destination=Pune          # Filter by destination city
&date=2025-10-01          # Filter by departure date
&minSeats=2               # Minimum available seats
&maxPrice=500             # Maximum price per person
&page=1                   # Pagination
&limit=10                 # Results per page
```

## 🎨 Frontend Pages

### Public Pages
- **Home**: Landing page with features and call-to-action
- **Login**: User authentication
- **Register**: New user signup

### Protected Pages
- **Dashboard**: User overview with quick actions
- **Find Rides**: Search and filter available rides
- **Post Ride**: Create new ride offers
- **My Rides**: Manage posted rides and track joined rides

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (salt rounds: 12)
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet.js for security headers
- MongoDB injection prevention

## 🌐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartcommute
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5000000
```

### Frontend (optional .env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🧪 Development Commands

### Backend
```bash
npm start       # Production server
npm run dev     # Development with nodemon
npm test        # Run tests (to be implemented)
```

### Frontend
```bash
npm start       # Development server (http://localhost:3000)
npm run build   # Production build
npm test        # Run tests
npm run eject   # Eject from Create React App
```

## 🚧 Future Enhancements

### Phase 2 (Weeks 7-8)
- Real-time messaging with Socket.io
- Google Maps integration for route visualization
- Email/SMS notifications
- Advanced matching algorithms
- Payment gateway integration

### Phase 3 (Future)
- Mobile app (React Native)
- AI-powered ride recommendations
- Carbon footprint tracking
- Loyalty program
- Multi-language support

## 🤝 Contributing

This is an academic project for M.Tech Software Engineering dissertation.

**Student**: Kajal Chauhan  
**BITS ID**: 2021WA86054  
**Institution**: BITS Pilani  
**Supervisor**: Vikas Singh (Wipro)

## 📄 License

This project is developed for educational purposes as part of an M.Tech dissertation.

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify connection string format
- Check username/password
- Ensure IP whitelist includes your address

**Port Already in Use**
- Change PORT in .env file
- Kill processes using ports 3000 or 5000

**Dependencies Issues**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Ensure Node.js version is 18+

**CORS Errors**
- Verify frontend URL in backend CORS config
- Check if both servers are running

### Getting Help
1. Check console for error messages
2. Verify environment variables
3. Ensure MongoDB Atlas setup is correct
4. Check network connectivity
5. Review API endpoint URLs

## 🎯 Testing the Application

### Basic Flow Testing
1. **Register**: Create new user account
2. **Login**: Sign in with credentials
3. **Post Ride**: Create a ride offer
4. **Search**: Find available rides
5. **Join**: Join a ride as passenger
6. **Manage**: View and manage your rides

### API Testing
Use tools like Postman or cURL to test API endpoints:
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

Happy Coding! 🚗💨
