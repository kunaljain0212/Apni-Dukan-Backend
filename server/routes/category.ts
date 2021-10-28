import express from 'express';
import {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  removeCategory,
} from '../controllers/category';
import { isAdmin, isAuthenticated } from '../middlewares/authMiddleware';
import { isSignedin } from '../controllers/auth';
import { getUserById } from '../controllers/user';

const router = express.Router();

// param routes
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

// Create Route
router.post('/category/create/:userId', isSignedin, isAuthenticated, isAdmin, createCategory);

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

export default router;
