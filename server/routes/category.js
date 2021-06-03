import express from 'express';

const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  removeCategory,
} = require('../controllers/category');

const { isSignedin, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// param routes
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

// Create Route
router.post(
  '/category/create/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  createCategory
);

// Get category routes
router.get('/category/:categoryId', getCategory);
router.get('/categories/all', getAllCategories);

// Update category route
router.put(
  '/category/:categoryId/update/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// Delete category route
router.delete(
  '/category/:categoryId/delete/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
