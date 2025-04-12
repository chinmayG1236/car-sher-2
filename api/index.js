import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import journeyRoute from './routes/journey.route.js'
import notificationRoute from './routes/notification.route.js'
import cookieParser from 'cookie-parser';
import http from 'http'; 
import path from 'path';
// import { Server } from 'socket.io'; 

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log(err);
})

const __dirname = path.resolve();

const app=express();

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
});



app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.listen(3001,()=>{
//     console.log('Server listening on PORT:3001!');
// })
// server.listen(3001, () => {
//     console.log('Server running on PORT 3001');
// });

app.use('/api/user',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/journey',journeyRoute);
app.use('/api/notification',notificationRoute);


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })

})

// Store connected users { userId: socketId }
// const userSocketMap = {};

// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);

//   // Register the user with their userId
//   socket.on('registerUser', (userId) => {
//     userSocketMap[userId] = socket.id;
//     console.log(`User registered: ${userId} -> ${socket.id}`);
//     const receiverSocketId = userSocketMap[userId];
//     io.to(receiverSocketId).emit('trial message', {
//       message: 'socket working'
//     });
//   });

//   // Handle passengerInterested event
//   socket.on('passenger interested', ({ journey, passenger }) => {
//     const receiverSocketId = userSocketMap[journey.driver];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('request driver', {
//         journey, passenger
//       });
//       console.log(`Notified user ${journey.username} about interest from ${passenger.name}`);
//     } else {
//       console.log(`User ${journey.username} is not currently connected`);
//     }
//   });

//   socket.on('driver response', ({req}) => {
    
//   });

  

//   // Clean up on disconnect
//   socket.on('disconnect', () => {
//     for (const userId in userSocketMap) {
//       if (userSocketMap[userId] === socket.id) {
//         delete userSocketMap[userId];
//         console.log(`User ${userId} disconnected`);
//         break;
//       }
//     }
//   });
// });
