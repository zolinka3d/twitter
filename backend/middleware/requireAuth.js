const requeireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(403).json({
      timestamp: Date.now(),
      msg: "Access denied. Unauthorised user.",
      code: 403,
    });
  }
};

module.exports = requeireAuth;
