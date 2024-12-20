const Product = require('../models/productModel');
const Protein = require('../models/proteinModel');

exports.addProteins = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Product Id is required',
    });
  }

  const { name, price } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Protein name is required',
    });
  }

  if (!price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Price is required',
    });
  }
  const paymentProof = req.file ? req.file.path : null;

  if (!paymentProof) {
    return res.status(400).json({
      status: 'fail',
      data: {
        message: 'Protein image is required',
      },
    });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    const newProtein = await Protein.create({
      productId,
      name,
      price,
      paymentProof,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        newProtein,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editProtein = async (req, res) => {
  const { proteinId } = req.params;

  if (!proteinId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Protein Id is required',
    });
  }

  const { name, price } = req.body;

  const paymentProof = req.file ? req.file.path : null; // Get payment proof image URL

  try {
    const protein = await Protein.findById(proteinId);

    if (!protein) {
      return res.status(404).json({
        status: 'fail',
        message: 'Protein not found',
      });
    }

    if (name) {
      protein.name = name;
    }

    if (price) {
      protein.price = price;
    }

    if (paymentProof) {
      protein.paymentProof = paymentProof;
    }

    const newProtein = await protein.save();

    return res.status(200).json({
      status: 'success',
      data: {
        newProtein,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteProtein = async (req, res) => {
  const { proteinId } = req.params;

  if (!proteinId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Protein Id is required',
    });
  }

  try {
    const protein = await Protein.findById(proteinId);

    if (!protein) {
      return res.status(404).json({
        status: 'fail',
        message: 'Protein not found',
      });
    }

    await Protein.findByIdAndDelete(proteinId);

    return res.status(200).json({
      status: 'success',
      message: 'Protein deleted',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.findProteins = async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Product Id is required',
    });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    const protein = await Protein.find({ productId });

    // if (protein.length === 0) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     message: 'Protein not found',
    //   });
    // }

    return res.status(200).json({
      status: 'success',
      data: {
        protein,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
