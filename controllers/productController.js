const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Product = require('../models/productModel');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer-storage-cloudinary
const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'product_covers',
    format: async (req, file) => 'jpeg', // supports promises as well
    public_id: (req, file) => `cover-${Date.now()}`,
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Cloudinary transformation
  },
});

const imagesStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'product_images',
    format: async (req, file) => 'jpeg', // supports promises as well
    public_id: (req, file) => `image-${Date.now()}`,
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const uploadCover = multer({
  storage: coverStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

const uploadImages = multer({
  storage: imagesStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Use multer fields to handle both imageCover and images
const uploadProductFiles = multer({
  storage: coverStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

// upload images
exports.uploadProductFiles = uploadProductFiles;

// add product
exports.addProduct = async (req, res) => {
  const requiredFields = [
    'name',
    'price',
    'discount',
    'description',
    'summary',
    'superCategory',
    'category',
    'productDetails',
  ];

  // Validate request body
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ status: 'fail', message: `${field} is required` });
    }
  }

  // Validate imageCover file
  if (
    !req.files ||
    !req.files.imageCover ||
    req.files.imageCover.length === 0
  ) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Image Cover is required' });
  }

  // Validate images field
  if (!req.files || !req.files.images || req.files.images.length === 0) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'At least one image is required' });
  }

  try {
    const {
      name,
      price,
      discount,
      description,
      summary,
      superCategory,
      category,
      productDetails,
      productStock,
      keyFeatures,
    } = req.body;

    const imageCover = req.files.imageCover[0].path; // Cloudinary URL

    // Extract images
    const images = req.files.images.map((file) => file.path); // Array of Cloudinary URLs

    // Process the product creation here
    const newProduct = await Product.create({
      name,
      price,
      discount,
      description,
      summary,
      superCategory,
      category,
      productDetails,
      productStock,
      keyFeatures,
      imageCover,
      images,
    });

    res.status(201).json({
      status: 'success',
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by ID and delete it
    const product = await Product.findByIdAndDelete(productId);

    // Check if the product existed and was deleted
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Product deleted successfully',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate that the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    const updatedFields = [
      'name',
      'price',
      'discount',
      'description',
      'summary',
      'superCategory',
      'category',
      'productDetails',
      'productStock',
      'keyFeatures',
    ];

    // Update product fields
    updatedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Handle image updates if new files are provided
    if (req.files) {
      if (req.files.imageCover) {
        product.imageCover = req.files.imageCover[0].path; // Cloudinary URL
      }
      if (req.files.images) {
        product.images = req.files.images.map((file) => file.path); // Array of Cloudinary URLs
      }
    }

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

