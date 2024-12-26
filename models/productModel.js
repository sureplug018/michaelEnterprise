const mongoose = require('mongoose');
const slugify = require('slugify');

const variationSchema = new mongoose.Schema({
  color: String,
  size: String,
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    categorySlug: String,
    ratingsAverage: {
      type: String,
      default: '0',
    },
    ratingsQuantity: String,
    summary: {
      type: String,
      // required: true,
    },
    superCategory: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    productDetails: {
      type: String,
    },
    productStock: {
      type: Number,
      required: function () {
        return !this.variations || this.variations.length === 0;
      },
    },
    superCategorySlug: String,
    variations: {
      type: [variationSchema],
      default: [],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    proteins: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Protein', // Replace 'Protein' with the actual name of your protein model
      },
    ],
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
productSchema.index({ categorySlug: 1 });

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'productId',
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

productSchema.pre('save', function (next) {
  const lowercaseName = this.superCategory.toLowerCase();

  this.superCategorySlug = slugify(lowercaseName);
  next();
});

productSchema.pre('save', function (next) {
  const lowercaseName = this.category.toLowerCase();

  this.categorySlug = slugify(lowercaseName);
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
