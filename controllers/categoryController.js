const Category = require('../models/categoryModel');

exports.addCategory = async (req, res) => {
  try {
    const { name, superCategory } = req.body.name;

    if (!name) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category is required',
      });
    }

    const newCategory = await Category.create({
      name,
      superCategory,
    });

    res.status(200).json({
      status: 'success',
      data: {
        newCategory,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.fetchCategories = async (req, res) => {
  const { superCategory } = req.query;

  if (!superCategory) {
    return res.status(400).json({
      status: 'fail',
      message: 'Category is required',
    });
  }
  try {
    const categories = await Category.find({ superCategory });

    return res.status(200).json({
      status: 'success',
      data: {
        categories,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
