import { loginService } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await loginService(
      username,
      password
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      data: result,
    });

  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};