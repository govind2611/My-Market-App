const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const BCRYPT_SALTS = Number(process.env.BCRYPT_SALTS);

// Create a new vendor
exports.createVendor = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALTS);

    const vendor = new User({ username, password: hashedPassword, role: role });

    await vendor.save();

    const token = jwt.sign({ userId: vendor._id, username: vendor.username, role: vendor.role }, process.env.JWT_SECRET);

    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully!',
      token,
      vendor: { username: vendor.username, role: vendor.role },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.loginVendor = async (req, res) => {
  try {
    const { username, password } = req.body;

    const vendor = await User.findOne({ username });

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const passwordMatch = await bcrypt.compare(password, vendor.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign({ userId: vendor._id, username: vendor.username, role: vendor.role }, process.env.JWT_SECRET);

    req.locals = { token };

    res.status(200).json({
      success: true,
      message: 'Vendor logged in successfully!',
      token,
      vendor: { username: vendor.username, role: vendor.role },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images } = req.body;

    const vendorId = req.user.userId;

    const product = new Product({ name, description, price, category, images, vendor: vendorId });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully by the vendor!',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {

    const { name, description, price, category, images } = req.body;
    const productId = req.params.id;

    const vendorId = req.user.userId;

    const product = await Product.findOne({ _id: productId, vendor: vendorId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized to update',
      });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.images = images;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully by the vendor!',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const vendorId = req.user.userId;

    const product = await Product.findOne({ _id: productId, vendor: vendorId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized to delete',
      });
    }

    await Product.findByIdAndDelete(productId);

    res.status(204).json({
      success: true,
      message: 'Product deleted successfully by the vendor!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};