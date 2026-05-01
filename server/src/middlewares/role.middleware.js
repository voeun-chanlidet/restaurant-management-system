const restrictTo = (...roles) => {
  return (request, response, next) => {
    if (roles.includes(request.user.role)) {
      next();
    } else {
      return response.status(403).json({ error: "Access Denied" });
    }
  };
};

module.exports = restrictTo;
