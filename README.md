# Real-Time Chat Application with File Sharing

This is a Node.js based real-time chat application with file sharing capabilities, built using Express, Socket.IO, and MongoDB.

# Author Information

**Name:** Nazmus Shakib  
**GitHub:** [shakib77](https://github.com/shakib77/)  
**LinkedIn:** [shakib77](https://www.linkedin.com/in/shakib77/)


## Features

- Real-time messaging
- User authentication
- File sharing
- Message history
- MongoDB for data persistence

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- npm/yarn/pnpm

## Installation

1. Clone the repository

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/chat_app
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   UPLOAD_DIR=./uploads
   ```
   Replace `your_jwt_secret_key_here` with a strong, unique secret key.

4. Create an `uploads` directory in the project root:
   ```
   mkdir uploads
   ```

## Running the Application

1. Start the MongoDB service (if not already running):
   ```
   sudo service mongodb start
   ```

2. Run the application in development mode:
   ```
   npm run dev
   ```

The server will start on `http://localhost:3000`.

## Testing

To run the unit tests:

```
npm test
```

## API Endpoints

- POST `/api/auth/register`: Register a new user
- POST `/api/auth/login`: Login a user
- GET `/api/chat/history/:room`: Get chat history for a room
- POST `/api/chat/upload/:room`: Upload a file to a room
- GET `/api/chat/file/:filename`: Download a file

## Socket.IO Events

- `authenticate`: Authenticate the socket connection
- `join room`: Join a chat room
- `leave room`: Leave a chat room
- `chat message`: Send a chat message
- `file shared`: Notify when a file is shared

## Docker

To run the application using Docker:

1. Build the Docker image:
   ```
   docker-compose build
   ```

2. Start the containers:
   ```
   docker-compose up
   ```

The application will be available at `http://localhost:3000`.

