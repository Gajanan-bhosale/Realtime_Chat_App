import * as userService from './user.services.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const listUserController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { users, totalUser } = await userService.listUser({ page, limit });

  return res.status(200).json({
    status: 'Success',
    message: 'User list retrieved successfully',
    data: users,
    totalCount: totalUser,
    page,
    limit,
  });
});

export const getUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await userService.getUser({ userId });

  return res.status(200).json({
    status: 'Success',
    message: 'User retrieved successfully',
    data: user,
  });
});

export const blockUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const result = await userService.blockUser({ userId });

  return res.status(200).json({
    status: 'Success',
    message: result.message,
    data: result.user,
  });
});

export const unblockUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const result = await userService.unblockUser({ userId });

  return res.status(200).json({
    status: 'Success',
    message: result.message,
    data: result.user,
  });
});

export const forceLogoutUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const result = await userService.forceLogoutUser({ userId });

  return res.status(200).json({
    status: 'Success',
    message: result.message,
    data: result.user,
  });
});
