const verifyUserRole = async (...roles) => {
  return (res, req, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'Failed',
        message: 'User not found',
      });
    }

    if (roles.includes(req.user.role)) {
      return res.status(402).json({
        status: 'Failed',
        message: 'Unauthorized: You can access resources.',
      });
    }

    next();
  };
};

export default verifyUserRole;
