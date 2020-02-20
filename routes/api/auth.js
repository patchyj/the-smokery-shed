import { Router } from 'express';
import bcrypt from 'bcryptjs';
import config from '../../config';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth';
// User Model
import User from '../../models/User';
import validateLoginInput from '../../validation/login';
import validateRegisterInput from '../../validation/register';

const { JWT_SECRET } = config;
const router = Router();

const authValidation = (body, type) => {
  const err = {};
  if (!body.email) err.email = 'Email field missing';
  if (!body.password) err.password = 'Password field missing';

  if (type === 'REGISTER') {
    if (!body.name) err.name = 'Name field missing';
    if (!body.password2) err.password2 = 'Password Confirmation field missing';
    if (body.password !== body.password2) err.noMatch = 'Passwords must match';
  }

  const response = {
    success: true,
    errors: {}
  };

  if (Object.keys(err).length) {
    response.success = false;
    response.errors = err;
  }

  return response;
};

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  console.log(errors);
  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) throw Error('User does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw Error('Couldnt sign the token');

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (e) {
    const err = e.message === 'User does not exist' ? { email: e.message } : { error: e.message };
    res.status(400).json(err);
  }
});

/**
 * @route   POST api/users
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) throw Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new User({
      name,
      email,
      password: hash
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Something went wrong saving the user');

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (e) {
    const err = e.message === 'User already exists' ? { email: e.message } : { error: e.message };
    res.status(400).json(err);
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User does not exist');
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

export default router;
