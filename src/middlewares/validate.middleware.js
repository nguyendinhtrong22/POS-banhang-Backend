export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || username.trim() === "") {
    return res.status(400).json({
      message: "Username không được để trống",
    });
  }

  if (!password || password.trim() === "") {
    return res.status(400).json({
      message: "Password không được để trống",
    });
  }

  next();
};