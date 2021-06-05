import Category from '../models/category';

// param routes
export const getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        err: 'Category not found in DB',
      });
    }
    req.category = cate;
    return next();
  });
};

// Create Route
export const createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((error, category) => {
    if (error) {
      return res.status(400).json({
        error: 'NOT able to save category',
      });
    }
    return res.status(200).json({ category });
  });
};

// Get category routes
export const getCategory = (req, res) => res.json(req.category);

export const getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.json(categories);
  });
};

// Update category route
export const updateCategory = (req, res) => {
  const { category } = req;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        err: 'FAILED TO UPDATE CATEGORY',
      });
    }
    return res.json(updatedCategory);
  });
};

// Delete category route
export const removeCategory = (req, res) => {
  const { category } = req;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        err: 'FAILED TO REMOVE CATEGORY',
      });
    }
    return res.json({
      message: `${category.name} SUCCESSFULLY DELETED`,
    });
  });
};
