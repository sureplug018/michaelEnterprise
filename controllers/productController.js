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

exports.addProduct = async (req, res) => {
  const requiredFields = [
    'name',
    'price',
    'initialPrice',
    'description',
    'summary',
    'superCategory',
    'category',
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
      initialPrice,
      description,
      summary,
      superCategory,
      category,
      productStock,
      variations, // Expecting variations to be sent as a JSON string
    } = req.body;

    const imageCover = req.files.imageCover[0].path; // Cloudinary URL

    // Extract images
    const images = req.files.images.map((file) => file.path); // Array of Cloudinary URLs

    // Process the variations
    let parsedVariations = [];
    try {
      parsedVariations = variations ? JSON.parse(variations) : [];
    } catch (err) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid variations format' });
    }

    // Validate productStock based on variations
    if (!parsedVariations.length && !productStock) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product stock is required when there are no variations',
      });
    }

    // Process the product creation here
    const newProduct = await Product.create({
      name,
      price,
      initialPrice,
      description,
      summary,
      superCategory,
      category,
      productStock,
      imageCover,
      images,
      variations: parsedVariations,
    });

    res.status(201).json({
      status: 'success',
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (err) {
    console.log(err);
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
  // const requiredFields = [
  //   'name',
  //   'price',
  //   'initialPrice',
  //   'description',
  //   'summary',
  //   'superCategory',
  //   'category',
  // ];

  const { productId } = req.params;

  // Check if the product exists

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Product not found' });
  }

  // // Validate request body fields only if they exist
  // for (const field of requiredFields) {
  //   if (req.body[field] && !req.body[field].trim()) {
  //     return res
  //       .status(400)
  //       .json({ status: 'fail', message: `${field} cannot be empty` });
  //   }
  // }

  // // Validate imageCover file if provided
  // if (req.files && req.files.imageCover && req.files.imageCover.length === 0) {
  //   return res
  //     .status(400)
  //     .json({ status: 'fail', message: 'Image Cover cannot be empty' });
  // }

  // // Validate images field if provided
  // if (req.files && req.files.images && req.files.images.length === 0) {
  //   return res
  //     .status(400)
  //     .json({ status: 'fail', message: 'At least one image is required' });
  // }

  try {
    const {
      name,
      price,
      initialPrice,
      description,
      summary,
      productStock,
      variations,
      availability, // Expecting variations to be sent as a JSON string
    } = req.body;

    // Handle imageCover update
    const imageCover = req.files?.imageCover
      ? req.files.imageCover[0].path // Cloudinary URL
      : product.imageCover;

    // Handle images update
    const images = req.files?.images
      ? req.files.images.map((file) => file.path) // Array of Cloudinary URLs
      : product.images;

    // Process the variations
    let parsedVariations = [];
    try {
      parsedVariations = variations
        ? JSON.parse(variations)
        : product.variations;
    } catch (err) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid variations format' });
    }

    // Validate productStock based on variations only if productStock is provided
    // if (
    //   !parsedVariations.length &&
    //   productStock === undefined &&
    //   !product.productStock
    // ) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message: 'Product stock is required when there are no variations',
    //   });
    // }

    // Update the product
    // const updatedProduct = await Product.findByIdAndUpdate(
    //   productId,
    //   {
    //     name,
    //     price,
    //     initialPrice,
    //     description,
    //     summary,
    //     productStock:
    //       productStock !== undefined ? productStock : product.productStock,
    //     imageCover,
    //     images,
    //     variations: parsedVariations,
    //   },
    //   { new: true, runValidators: true },
    // );

    if (name) {
      product.name = name;
    }

    if (price) {
      product.price = price;
    }

    if (initialPrice) {
      product.initialPrice = initialPrice;
    }

    if (description) {
      product.description = description;
    }

    if (summary) {
      product.summary = summary;
    }

    if (productStock) {
      product.productStock = productStock;
    }

    if (imageCover) {
      product.imageCover = imageCover;
    }

    if (images) {
      product.images = images;
    }

    if (variations) {
      product.variations = variations;
    }

    if (req.body.availability) {
      product.availability = availability;
    }

    await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.findProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    // Create a filter object
    const filter = {};

    // If a category is provided and it's not 'all', map it to categorySlug in the filter
    if (category && category.trim().toLowerCase() !== 'all') {
      filter.categorySlug = category.trim();
    }

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the skip value
    const skip = (pageNumber - 1) * limitNumber;

    // Find products based on the filter with pagination
    const products = await Product.find(filter).skip(skip).limit(limitNumber);

    // Get the total count of products for pagination metadata
    const totalCount = await Product.countDocuments(filter);

    // Respond with the paginated products and metadata
    res.status(200).json({
      status: 'success',
      results: products.length,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.increaseProductStock = async (req, res) => {
  const productId = req.params.productId;

  if (!productId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Product not found',
    });
  }
  try {
    const productStock = req.body.productStock;

    if (!productStock) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product quantity is required',
      });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { productStock },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Search endpoint
exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i'); // 'i' makes it case-insensitive
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        // Add other fields you want to search through
      ],
    });
    res.status(200).json({
      status: 'success',
      length: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
