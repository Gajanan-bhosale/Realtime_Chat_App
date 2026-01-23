import mongoose from 'mongoose';
import User from './user.models.js';

export const listUser = async ({ page = 1, limit = 10 }) => {
  page = Number(page);
  limit = Number(limit);
  const skip = (page - 1) * limit;

  const [users, totalUser] = await Promise.all([
    User.find({ isDeleted: false })
      .select('-password -refreshToken')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    User.countDocuments({ isDeleted: false }),
  ]);

  return { users, totalUser };
};

export const getUser = async ({ userId }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid user id');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId).select('-password -refreshToken');

  if (!user) {
    const error = new Error('USer not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const blockUser = async ({ userId }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('INvalid user id');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.status === 'blocked') {
    const error = new Error('User already blocked');
    error.statusCode = 409;
    throw error;
  }

  user.status = 'blocked';

  await user.save();

  return {
    user: {
      userId: user._id,
      username: user.name,
      email: user.email,
      status: user.status,
    },
    message: 'User blocked successfully',
  };
};

export const unBlockedUser = async ({ userId }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('INvalid user id');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.status === 'unblocked') {
    const error = new Error('User is already unblocked');
    error.statusCode = 409;
    throw error;
  }

  user.status = 'unblocked';
  await user.save();

  return {
    user: {
      userId: user._id,
      username: user.name,
      email: user.email,
      status: user.status,
    },
    message: 'User unblocked successfully',
  };
};

export const forceLogoutUser = async ({ userId }) => {
  if (!userId) {
    const error = new Error('User id not provided');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.refreshToken = null;
  await user.save();

  return { message: 'User session cleared' };
};
