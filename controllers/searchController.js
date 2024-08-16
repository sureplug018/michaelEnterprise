const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

exports.search = async (req, res) => {
  try {
    const { query } = req.query;

    // Find products matching the search query in the name, description, or category fields
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search in name
        { description: { $regex: query, $options: 'i' } }, // Case-insensitive search in description
        { category: { $regex: query, $options: 'i' } }, // Case-insensitive search in category
      ],
    });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
