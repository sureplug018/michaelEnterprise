const Category = require('../models/categoryModel');

exports.addCategory = async (req, res) => {
  try {
    const name = req.body.name;

    if (!name) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category is required',
      });
    }

    const newCategory = await Category.create({
      name,
    });

    res.status(200).json({
      status: 'success',
      data: {
        newCategory,
      },
    });
  } catch (err) {
      console.log(err)
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
