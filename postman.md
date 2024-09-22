
# Testing the Chat Application using Postman and Socket.IO

## Step 1: Start the Application

1. Open a terminal in your project directory.
2. Run the following commands:
   ```bash
   npm install
   npm run dev
   ```
   This will install dependencies and start the application in development mode.

## Step 2: Set Up Postman Collection

- Open Postman and create a new collection for your chat application.

## Step 3: Test User Registration

1. Create a new `POST` request.
2. Set the URL to:
   ```
   http://localhost:3000/api/auth/register
   ```
3. In the "Body" tab, select `raw` and `JSON`.
4. Enter the following JSON:
   ```json
   {
     "username": "testuser",
     "password": "testpassword"
   }
   ```
5. Send the request.

- You should receive a response with a user object and a token.

## Step 4: Test User Login

1. Create a new `POST` request.
2. Set the URL to:
   ```
   http://localhost:3000/api/auth/login
   ```
3. In the "Body" tab, select `raw` and `JSON`.
4. Enter the following JSON:
   ```json
   {
     "username": "testuser",
     "password": "testpassword"
   }
   ```
5. Send the request.

- You should receive a response with a user object and a token.

## Step 5: Test Getting Chat History

1. Create a new `GET` request.
2. Set the URL to:
   ```
   http://localhost:3000/api/chat/history/general
   ```
3. In the "Headers" tab, add a new header:
    - **Key:** `Authorization`
    - **Value:** `Bearer <token>` (replace `<token>` with the token received from login)
4. Send the request.

- You should receive an array of messages (it may be empty if no messages have been sent).

## Step 6: Test File Upload

1. Create a new `POST` request.
2. Set the URL to:
   ```
   http://localhost:3000/api/chat/upload/general
   ```
3. In the "Headers" tab, add the `Authorization` header as in Step 5.
4. In the "Body" tab, select `form-data`.
5. Add a new key-value pair:
    - **Key:** `file` (change type to "File")
    - **Value:** Select a file from your computer.
6. Send the request.

- You should receive a response with the file metadata.

## Step 7: Test File Download

1. Create a new `GET` request.
2. Set the URL to:
   ```
   http://localhost:3000/api/chat/file/<filename>
   ```
   (replace `<filename>` with the filename received from the upload response).
3. In the "Headers" tab, add the `Authorization` header as in Step 5.
4. Send the request.

- The file should be downloaded.

## Step 8: Test Real-time Messaging (Using Socket.IO)

> **Note:** This cannot be done directly in Postman. Use a tool like `Socket.IO Client`.

1. Install the Socket.IO Client:
   ```bash
   npm install -g socket.io-client
   ```
2. Open a new terminal and run:
   ```bash
   node
   ```
3. In the Node.js REPL, enter the following code:
   ```javascript
   const io = require('socket.io-client');
   const socket = io('http://localhost:3000');

   socket.on('connect', () => {
     console.log('Connected to server');
     socket.emit('authenticate', '<token>'); // Replace <token> with a valid JWT token
   });

   socket.on('authenticated', () => {
     console.log('Authenticated');
     socket.emit('join room', 'general');
   });

   socket.on('chat message', (data) => {
     console.log('Received message:', data);
   });

   // To send a message:
   socket.emit('chat message', { room: 'general', message: 'Hello, world!' });
   ```
