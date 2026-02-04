import mongoose from 'mongoose';
import User from '../api/users/user.models.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Token not found',
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken.userId).select(
      '-password -refreshToken',
    );

    if (!user) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Unauthorized',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Invalid token', error.message);
    res.status(400).json({
      status: 'Failed',
      message: 'Invalid token',
    });
  }
};
