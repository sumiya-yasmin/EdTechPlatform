import * as authService from '../services/authServices.js';

export const registerUser = async (req, res) => {
  try {
    const userData = await authService.registerUserService(req.body);
    res.status(201).json(userData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const userData = await authService.loginUserService(req.body);
    res.status(200).json(userData);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};