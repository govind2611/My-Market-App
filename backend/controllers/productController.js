const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    const { name, description, price, category, image } = req.body;
  
    try {
      const product = new Product({ name, description, price, category, image });
      await product.save();
  
      res.status(201).json({
        success: true,
        message: 'Product created successfully!',
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
  
  // Get all products
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
  
      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully!',
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
  
  // Get a single product
exports.getProductById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await Product.findById(id);
  
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found!',
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: 'Product retrieved successfully!',
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
  
  // Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, images } = req.body;
  
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { name, description, price, category, images },
        { new: true }
      );
  
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found!',
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: 'Product updated successfully!',
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
  
  // Delete a product
  exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      await Product.findByIdAndDelete(id);
  
      res.status(201).json({
        success: true,
        message: 'Product deleted successfully!',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };