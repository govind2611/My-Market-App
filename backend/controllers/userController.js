const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const BCRYPT_SALTS = Number(process.env.BCRYPT_SALTS);

exports.createUser = async (req, res) => {
  try {
    const { username, password, role  } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALTS);

    const user = new User({ username, password: hashedPassword, role: role });

    await user.save();

    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET);
    req.locals = { token };

    res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};