import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './auth.model';

// Helper to generate JWT
const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Only allow valid roles; default to Employee
    const userRole = ['Admin', 'Manager', 'Employee'].includes(role) ? role : 'Employee';

    const user = await User.create({ name, email, password, role: userRole });

    const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
    const token = generateToken(payload);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: payload,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user with password field explicitly selected
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
    const token = generateToken(payload);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: payload,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me  (get current logged-in user)
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
