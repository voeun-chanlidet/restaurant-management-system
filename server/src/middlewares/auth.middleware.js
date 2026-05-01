const User = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

const protect = async (request, response, next) => {
  try {
    const token = getTokenFrom(request);
    if (!token) {
      return response.status(401).json({
        error: "Token missing",
      });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    const user = await User.findByPk(decodedToken.id);

    if (!user) {
      return response.status(404).json({ error: "User no longer exists" });
    }
    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
