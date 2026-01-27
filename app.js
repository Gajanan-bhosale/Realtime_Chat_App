import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './src/api/auth/authRoutes.js';
import userRoute from './src/api/users/userRoutes.js';
import chatRoute from './src/api/chats/chatsRoutes.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.use('/api/v1/chatApp/auth', authRoute);
app.use('/api/v1/chatApp/user', userRoute);
app.use('/api/v1/chatApp/chat', chatRoute);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed ti start server', error.message);
    process.exit(1);
  }
};

startServer();
