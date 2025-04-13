import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import journeyRoute from './routes/journey.route.js';
import notificationRoute from './routes/notification.route.js';
import cookieParser from 'cookie-parser';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

dotenv.config();


const __dirname = path.resolve(); // get root dir directly

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// HTTP Server + Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://car-sher-2.onrender.com/", // or your frontend domain
    methods: ["GET", "POST"],
  }
});

// Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/journey', journeyRoute);
app.use('/api/notification', notificationRoute);

// Serve frontend (for deployment)
// app.use(express.static(path.join(__dirname, 'client', 'dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
});


// Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Connected Users Map
const userSocketMap = {};

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('registerUser', (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User registered: ${userId} -> ${socket.id}`);
    const receiverSocketId = userSocketMap[userId];
    io.to(receiverSocketId).emit('trial message', {
      message: 'socket working'
    });
  });

  socket.on('passenger interested', ({ journey, passenger }) => {
    const receiverSocketId = userSocketMap[journey.driver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('request driver', {
        journey,
        passenger
      });
      console.log(`Notified user ${journey.username} about interest from ${passenger.name}`);
    } else {
      console.log(`User ${journey.username} is not currently connected`);
    }
  });

  socket.on('driver response', (data) => {
    const receiverSocketId = userSocketMap[data.passenger];
    if(receiverSocketId){
        io.to(receiverSocketId).emit('send driver response',{
            driverName:`${data.driverName}`, message:`${data.message}`
        });
    }
    
  });

  socket.on('disconnect', () => {
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Start the Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
