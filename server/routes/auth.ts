import express from 'express';
import { check } from 'express-validator';
import { signout, signup, signin, googleLogin, facebookLogin } from '../controllers/auth';

const router = express.Router();

router.post(
  '/signup',
  [
    check('name', 'Name should be atleast 3 char').isLength({ min: 3 }),
    check('email', 'Enter proper email').isEmail(),
    check('password', 'Password should be atleast 3 char').isLength({ min: 3 }),
  ],
  signup
);

router.post(
  '/signin',
  [
    check('email', 'Enter proper email').isEmail(),
    check('password', 'Password should be atleast 3 char').isLength({ min: 1 }),
  ],
  signin
);

router.post('/googleLogin', googleLogin);

router.post('/facebookLogin', facebookLogin);
router.get('/signout', signout);

export default router;
