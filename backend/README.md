# SmartCommute Backend with Ride Management

## Features Added
- Complete ride management system
- User authentication and profiles
- Ride creation, search, and joining
- Advanced filtering and pagination
- Trust score system foundation

## Setup
1. Install dependencies: `npm install`
2. Create `.env` file with your MongoDB URI
3. Run: `npm run dev`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Rides
- POST `/api/rides` - Create ride (authenticated)
- GET `/api/rides` - Search rides (with filters)
- GET `/api/rides/my` - Get my rides as driver
- GET `/api/rides/joined` - Get rides I joined
- POST `/api/rides/:id/join` - Join a ride
- DELETE `/api/rides/:id/leave` - Leave a ride
- GET `/api/rides/:id` - Get ride details

### Users
- GET `/api/users/stats` - Platform statistics
