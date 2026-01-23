import * as authService from './auth.services.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const registerUserController = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await authService.registerUser({
    name,
    email,
    password,
  });

  return res.status(201).json({
    status: 'Success',
    message: 'User created successfully',
    data: user,
  });
};

export const loginUserController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.loginUser({
    name,
    email,
    password,
  });

  const cookieOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      status: 'success',
      message: 'User logged in successfully',
      data: user,
    });
});

export const logoutUserController = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  await authService.logoutUser(userId);

  const cookieOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json({
      status: 'success',
      message: 'User logged out successfully',
    });
});

export const changeCurrentPasswordController = asyncHandler(
  async (req, res) => {
    const { id: userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    await authService.changeCurrentPassword({
      userId,
      oldPassword,
      newPassword,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  },
);

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.body?.refreshToken || req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new Error('Unauthorized access');
  }

  const { accessToken, newRefreshToken } =
    await authService.refreshAccessToken(incomingRefreshToken);

  const cookieOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', newRefreshToken, cookieOptions)
    .json({
      status: 'Success',
      message: 'Access token refresh successfully',
    });
});

export const getUserDateController = asyncHandler(async (req, res) => {
  const user = await authService.getUserData(req.user._id);

  if (!user) {
    return res.status(404).json({
      status: 'failed',
      message: 'User not found',
    });
  }

  return res.status(200).json({
    status: 'Success',
    message: 'User data retrieved successfully',
    data: user,
  });
});
