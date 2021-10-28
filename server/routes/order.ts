import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/authMiddleware';

import { isSignedin } from '../controllers/auth';
import { getUserById, pushOrderInPurchaseList } from '../controllers/user';
import { updateInventory } from '../controllers/product';
import {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateOrderStatus,
} from '../controllers/order';

const router = express.Router();

// param routes
router.param('userId', getUserById);
router.param('orderId', getOrderById);

// create order route
router.post(
  '/order/create/:userId',
  isSignedin,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateInventory,
  createOrder
);

router.get('/orders/all/:userId', isSignedin, isAuthenticated, isAdmin, getAllOrders);

router.get('/order/status/:userId', isSignedin, isAuthenticated, isAdmin, getOrderStatus);

router.put(
  '/order/:orderId/status/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);

export default router;
