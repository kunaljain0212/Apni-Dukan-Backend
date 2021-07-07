import express from 'express';
import {
  getProductById,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
} from '../controllers/product';
import { isSignedin, isAuthenticated, isAdmin } from '../controllers/auth';
import { getUserById } from '../controllers/user';

const router = express.Router();

// param routes
router.param('userId', getUserById);
router.param('productId', getProductById);

// Create Route
router.post('/product/create/:userId', isSignedin, isAuthenticated, isAdmin, createProduct);

// Get product routes
router.get('/product/:productId', getProduct);

// Update product route
router.put('/product/:productId/:userId', updateProduct);

// Delete product route
router.delete('/product/:productId/:userId', deleteProduct);

// get all products
router.get('/products', getAllProducts);

// getting all categories so that user can put his product in one of these categories
router.get('/product/categories', getAllUniqueCategories);

export default router;
