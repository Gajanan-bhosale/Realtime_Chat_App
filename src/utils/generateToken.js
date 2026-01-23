import User from '../api/users/user.models.js';

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.status = 400;
      throw error;
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Failed to generate tokens', error.message);
    throw error;
  }
};

export default generateAccessAndRefreshToken;
