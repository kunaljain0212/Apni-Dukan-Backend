import express from 'express';
import { check } from 'express-validator';
import { signout, signup, signin, isSignedin } from '../controllers/auth';

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

router.get('/signout', signout);

router.get('/testroute', isSignedin, (req, res) => {
  res.send(req.auth);
});

module.exports = router;
