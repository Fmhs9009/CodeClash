import express from 'express';
import mongoose from 'mongoose';
import router from './router/router.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();



const app = express();
// Use environment variables for configuration
const API_PORT = process.env.API_PORT || 4444; // REST API port
const SOCKET_PORT = process.env.SOCKET_PORT || 3000; // WebSocket server port
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydb';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use('/', router);

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        app.listen(API_PORT, () => {
            console.log(`✅ Backend API Server -> http://localhost:${API_PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error while connecting to MongoDB:', err.message);
        console.log('⚠️  Starting server without database connection...');
        app.listen(API_PORT, () => {
            console.log(`⚠️  Backend API Server (No DB) -> http://localhost:${API_PORT}`);
        });
    });

// WebSocket Server
const server = createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: CORS_ORIGIN, 
    credentials: true 
  } 
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log(`🔌 USER DISCONNECTED: ${socket.id}`);
        
        // Update user count in the room they were in
        if (socket.data.roomid) {
            const roomid = socket.data.roomid;
            const roomUsers = io.sockets.adapter.rooms.get(roomid);
            const userCount = roomUsers ? roomUsers.size : 0;
            
            console.log(`📡 Updating user count for room ${roomid}: ${userCount}`);
            console.log(`   Remaining users:`, Array.from(roomUsers || []));
            
            io.to(roomid).emit('room-users-count', userCount);
        } else {
            console.log(`   User was not in any room`);
        }
    });

    socket.on('join-room', (roomid) => {
        socket.join(roomid);
        socket.data.roomid = roomid;
        
        // Get updated user count
        const roomUsers = io.sockets.adapter.rooms.get(roomid);
        const userCount = roomUsers ? roomUsers.size : 0;
        
        console.log(`🔗 User ${socket.id} joined room ${roomid} (${userCount} users)`);
        
        // Send updated user count to all users in the room
        io.to(roomid).emit('room-users-count', userCount);
    });

    socket.on('update-code', ({ NewCode, roomid }) => {
        if (socket.data.roomid === roomid) {
            socket.to(roomid).emit('send-code', NewCode);
        }
    });

    socket.on('update-input', ({ inputValue, roomid}) => {
        if (socket.data.roomid === roomid) {
            socket.to(roomid).emit('send-input', inputValue);
        }
    });

    socket.on('update-output', ({ outputVal, roomid}) => {
        if (socket.data.roomid === roomid) {
            socket.to(roomid).emit('send-output', outputVal);
        }
    });

    socket.on("update-language", ({ language, roomid }) => {
        console.log(`Language updated to ${language} in room ${roomid}`);
        socket.to(roomid).emit("send-language", language);
      });

    // Handle message sending
    socket.on("send-message", (messageData) => {
        const roomid = messageData.roomid;
        const messageText = messageData.message;
        const userName = messageData.name;
        const messageId = messageData.id;
        const timestamp = messageData.timestamp;
        const avatar = messageData.avatar;
        
        // Auto-join room if user is not in any room but trying to send message
        if (!socket.data.roomid && roomid) {
            socket.join(roomid);
            socket.data.roomid = roomid;
            
            // Send updated user count
            const roomUsers = io.sockets.adapter.rooms.get(roomid);
            const userCount = roomUsers ? roomUsers.size : 0;
            io.to(roomid).emit('room-users-count', userCount);
        }
        
        if (socket.data.roomid === roomid) {
          const broadcastMessage = {
            id: messageId || Date.now(),
            message: messageText,
            text: messageText, // For backward compatibility
            name: userName,
            senderUserName: userName, // For backward compatibility
            sender: socket.id,
            roomid: roomid,
            timestamp: timestamp || new Date().toISOString(),
            avatar: avatar || null
          };
          
          socket.to(roomid).emit("receive-message", broadcastMessage);
        }
      });
      
    // Handle typing indicators
    socket.on('typing', ({ name, roomid }) => {
        if (socket.data.roomid === roomid) {
            socket.to(roomid).emit('user-typing', { name, roomid });
            console.log(`${name} is typing in room ${roomid}`);
        }
    });

    socket.on('disconnect-room', (roomid) => {
        socket.leave(roomid);
        socket.data.roomid = null;
        
        // Get updated user count after leaving
        const roomUsers = io.sockets.adapter.rooms.get(roomid);
        const userCount = roomUsers ? roomUsers.size : 0;
        
        console.log(`🔗 USER LEFT ROOM:`);
        console.log(`   Socket: ${socket.id}`);
        console.log(`   Room: ${roomid}`);
        console.log(`   Remaining users: ${userCount}`);
        console.log(`   Room users:`, Array.from(roomUsers || []));
        
        // Send updated user count to remaining users in the room
        io.to(roomid).emit('room-users-count', userCount);
        console.log(`📡 Sent updated user count ${userCount} to room ${roomid}`);
    });
});

server.listen(SOCKET_PORT, () => {
    console.log(`✅ Socket Server -> http://localhost:${SOCKET_PORT}`);
});
