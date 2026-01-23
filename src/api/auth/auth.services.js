import mongoose from 'mongoose';
import generateAccessAndRefreshToken from '../../utils/generateToken.js';
import User from '../users/user.models.js';
import jwt from 'jsonwebtoken';

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const error = new Error('All fields are required to registered');
    error.statusCode = 400;
    throw error;
  }

  const existUser = await User.findOne({ email });

  if (existUser) {
    const error = new Error('Email is already exist');
    error.statusCode = 409;
    throw error;
  }

  const nameAlreadyTaken = await User.findOne({ name });

  if (nameAlreadyTaken) {
    const error = new Error(
      'This username is all ready taken. Please enter different username',
    );
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

export const loginUser = async ({ name, email, password }) => {
  if (!(name || email)) {
    const error = new Error('Name or Email is required to login');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const comparePassword = await user.validatePassword(password);

  if (!comparePassword) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  return { user, accessToken, refreshToken };
};

export const logoutUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid user id');
    error.statusCode = 400;
    throw error;
  }

  await User.findByIdAndUpdate(userId, {
    $unset: {
      refreshToken: 1,
    },
  });

  return { message: 'User logged out successfully' };
};

export const changeCurrentPassword = async ({
  userId,
  oldPassword,
  newPassword,
}) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid userId');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('ser not found');
    error.statusCode = 404;
    throw error;
  }

  const verifiedOldPassword = await user.validatePassword(oldPassword);

  if (!verifiedOldPassword) {
    const error = new Error('Invalid credentials');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: true });

  return { message: 'Password updated successfully' };
};

export const refreshAccessToken = async ({ userRefreshToken }) => {
  if (userRefreshToken) {
    const error = new Error('Unauthorized access');
    error.statusCode = 401;
    throw error;
  }

  const decodeToken = jwt.verify(
    userRefreshToken,
    process.env.JWT_REFRESH_SECRET,
  );

  const user = await User.findById(decodeToken._id);

  if (!user) {
    const error = new Error('Invalid refresh Token');
    error.statusCode = 401;
    throw error;
  }

  if (userRefreshToken !== user.refreshToken) {
    const error = new Error('Refresh token is expired or used.');
    error.statusCode = 400;
    throw error;
  }

  const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  return { accessToken, newRefreshToken };
};

export const getUserData = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid user id');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId).select('-password -refreshToken');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};
