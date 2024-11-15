const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    req.payload = payload;
    next();
  } catch {
    res.status(401).json("Token not provided or is not valid");
  }
};

module.exports = isAuthenticated;
