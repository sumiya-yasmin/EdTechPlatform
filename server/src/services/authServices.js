
import jwt from 'jsonwebtoken';
import config from '../config/envConfig.js'; 
import User from '../models/User.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUserService = async ({ name, email, password, role }) => {

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await user.create({ name, email, password, role });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  };
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};