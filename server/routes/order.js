import express from 'express';

const router = express.Router();

const { isSignedin, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const { updateInventory } = require('../controllers/product');

const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateOrderStatus,
} = require('../controllers/order');

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

router.get(
  '/orders/all/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

router.get(
  '/order/status/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

router.put(
  '/order/:orderId/status/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
