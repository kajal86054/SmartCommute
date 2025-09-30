# Complete Setup Guide for SmartCommute

This guide will help you set up the complete SmartCommute application with ride management features.

## 📋 Prerequisites

### Required Software
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org)
- **npm**: Comes with Node.js
- **Git** (optional): For version control
- **VS Code** (recommended): Code editor

### Required Accounts
- **MongoDB Atlas**: Free database hosting
- **GitHub** (optional): Code repository

## 🗄️ MongoDB Atlas Setup (Detailed)

### Step 1: Create Account
1. Visit [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Sign up with email, Google, or GitHub

### Step 2: Create Database
1. Choose "Build a Database"
2. Select "M0 Sandbox" (FREE tier)
3. Choose **AWS** as cloud provider
4. Select region closest to you
5. Name your cluster (default: "Cluster0")
6. Click "Create"

### Step 3: Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username: `smartcommute-user`
5. Generate/create secure password
6. **IMPORTANT**: Save these credentials safely!
7. Set user privileges: "Read and write to any database"
8. Click "Add User"

### Step 4: Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)
4. Add description: "Development Access"
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Add database name `smartcommute` after `.net/`

**Example Connection String:**
```
mongodb+srv://smartcommute-user:yourpassword@cluster0.xxxxx.mongodb.net/smartcommute?retryWrites=true&w=majority
```

## 🚀 Project Setup

### Step 1: Extract Project
1. Download and extract `smartcommute_with_rides.zip`
2. Open the folder in VS Code
3. Verify folder structure:
   ```
   smartcommute/
   ├── backend/
   ├── frontend/
   ├── README.md
   └── SETUP_GUIDE.md
   ```

### Step 2: Backend Setup

#### Install Dependencies
```bash
# Navigate to backend folder
cd smartcommute/backend

# Install all dependencies
npm install
```

#### Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your details:
   ```env
   # Replace with your MongoDB connection string
   MONGODB_URI=mongodb+srv://smartcommute-user:yourpassword@cluster0.xxxxx.mongodb.net/smartcommute?retryWrites=true&w=majority

   # Change this to a secure secret in production
   JWT_SECRET=smartcommute_jwt_secret_2025
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development

   # Upload settings
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5000000
   ```

#### Start Backend Server
```bash
# Start development server with auto-restart
npm run dev
```

**Expected Output:**
```
MongoDB Connected: cluster0-xxxxx.mongodb.net
SmartCommute Backend Server running on port 5000
Environment: development
```

### Step 3: Frontend Setup

#### Install Dependencies
```bash
# Open new terminal and navigate to frontend
cd smartcommute/frontend

# Install all dependencies
npm install
```

#### Start Frontend Server
```bash
# Start development server
npm start
```

**Expected Output:**
- Browser automatically opens to `http://localhost:3000`
- React development server starts
- Hot reloading enabled

## ✅ Verification & Testing

### 1. Backend API Health Check
Visit: `http://localhost:5000/api/health`

**Expected Response:**
```json
{
  "message": "SmartCommute API is running!",
  "timestamp": "2025-09-30T...",
  "version": "1.1.0"
}
```

### 2. Frontend Application
Visit: `http://localhost:3000`

**Expected Behavior:**
- Homepage loads with SmartCommute branding
- Navigation menu shows Login/Sign Up
- Responsive design works on mobile

### 3. Full User Journey Test
1. **Register New User**
   - Click "Sign Up"
   - Fill registration form
   - Should redirect to dashboard

2. **Post a Ride**
   - Go to "Post Ride"
   - Fill ride details form
   - Submit successfully

3. **Search Rides**
   - Go to "Find Rides"
   - Search without filters
   - Should see your posted ride

4. **Join Ride Flow**
   - Register another user
   - Search and join existing ride

## 🔧 Development Workflow

### Making Changes

#### Backend Changes
- Files automatically restart with nodemon
- Check console for error messages
- Test API endpoints with Postman/cURL

#### Frontend Changes
- Browser auto-refreshes with hot reloading
- Check browser console for React errors
- Use React Developer Tools for debugging

### Database Management
- View data in MongoDB Atlas dashboard
- Use MongoDB Compass for local database exploration
- Schema changes reflect automatically

## 🐛 Troubleshooting

### Common Backend Issues

**"Database connection failed"**
```
Solution:
1. Verify MongoDB URI format
2. Check username/password
3. Ensure IP is whitelisted (0.0.0.0/0)
4. Test connection string in MongoDB Compass
```

**"Port 5000 already in use"**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

**"Module not found" errors**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Common Frontend Issues

**"Proxy error" or API connection fails**
```
Solution:
1. Ensure backend is running on port 5000
2. Check proxy setting in package.json
3. Verify API URLs in frontend code
```

**"npm start fails"**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try starting again
npm start
```

**Browser shows blank page**
```
Solution:
1. Check browser console for errors
2. Verify all imports are correct
3. Check for JavaScript syntax errors
```

### Network Issues

**CORS errors**
```
Solution:
1. Verify frontend URL in backend CORS config
2. Check if both servers are running
3. Clear browser cache
```

## 📱 Features Overview

### Current Features (Week 6)
- ✅ User registration and authentication
- ✅ JWT token-based security
- ✅ Complete ride management (CRUD operations)
- ✅ Advanced ride search with filters
- ✅ Ride joining and leaving functionality
- ✅ User dashboard with statistics
- ✅ Responsive design for all devices

### API Endpoints Available
```
Authentication:
POST /api/auth/register     # Register user
POST /api/auth/login        # Login user
GET  /api/auth/me          # Get current user

Rides:
POST   /api/rides          # Create ride
GET    /api/rides          # Search rides (with filters)
GET    /api/rides/my       # My posted rides
GET    /api/rides/joined   # Rides I joined
POST   /api/rides/:id/join # Join a ride
DELETE /api/rides/:id/leave # Leave a ride
GET    /api/rides/:id      # Get ride details

Utilities:
GET /api/health            # API health check
GET /api/users/stats       # Platform statistics
```

## 🎯 Next Development Phase

### Ready for Implementation
1. **Real-time Features** (Socket.io)
   - Live messaging between users
   - Real-time ride status updates
   - Push notifications

2. **Maps Integration**
   - Google Maps route display
   - Location picker
   - Distance/time calculations

3. **Enhanced Features**
   - Email notifications
   - Rating system
   - Payment integration
   - Mobile app (React Native)

## 📞 Support

### Self-Help Resources
1. Check console logs for errors
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection

### Common Solutions
- Restart both servers
- Clear browser cache
- Check network connectivity
- Verify all dependencies installed

### Development Best Practices
- Use meaningful commit messages
- Test features before committing
- Keep environment variables secure
- Document any custom changes

---

**Happy Coding! 🚗💨**

If you encounter any issues not covered here, check the main README.md for additional troubleshooting tips.
