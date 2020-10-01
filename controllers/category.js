const Category = require("../models/category");

//param routes
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        err: "Category not found in DB",
      });
    }
    req.category = cate;
    next();
  });
};

//Create Route
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((error, category) => {
    if (error) {
      return res.status(400).json({
        error: "NOT able to save category",
      });
    }
    res.json({ category });
  });
};

//Get category routes
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(categories);
  });
};

//Update category route
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        err: "FAILED TO UPDATE CATEGORY",
      });
    }
    res.json(updatedCategory);
  });
};

//Delete category route
exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "FAILED TO REMOVE CATEGORY",
      });
    }
    res.json({
      message: `${category.name  } SUCCESSFULLY DELETED`,
    });
  });
};
