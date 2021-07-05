import express from 'express';
import { isSignedin, isAuthenticated } from '../controllers/auth';
import { getUserById, getUser, updateUser, userPurchaseList } from '../controllers/user';

const router = express.Router();

router.param('userId', getUserById);

router.get('/user/:userId', isSignedin, isAuthenticated, getUser);
router.put('/user/:userId', isSignedin, isAuthenticated, updateUser);
router.get('/orders/user/:userId', isSignedin, isAuthenticated, userPurchaseList);

export default router;
