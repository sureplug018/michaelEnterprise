const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    initialPrice: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    slug: String,
    ratingsAverage: String,
    ratingsQuantity: String,
    summary: {
      type: String,
      required: true,
    },
    superCategory: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    // images: {
    //   type: String,
    //   required: true,
    // },
    productDetails: {
      type: String,
    },
    productStock: {
      type: Number,
      required: true,
    },
    keyFeatures: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for filtering and sorting
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, price: -1 });
productSchema.index({ category: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Document middleware
productSchema.pre('save', function (next) {
  // Create a lowercase version of the name for slug generation
  const lowercaseName = this.name.toLowerCase();

  // Generate the slug using the lowercase name
  this.slug = slugify(lowercaseName);
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
