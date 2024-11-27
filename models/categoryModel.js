const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  superCategory: {
    type: String,
    required: true,
  },
  categorySlug: String,
});

categorySchema.pre('save', function (next) {
  const lowercaseName = this.name.toLowerCase();

  this.categorySlug = slugify(lowercaseName);
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
