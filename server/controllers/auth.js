import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import User from '../models/user';

export const signup = (req, res) => {
  // console.log("we entered");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error:
          'NOT able to save the user in database. Potential reason could be - Email already exists',
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

export const signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'USER not found!!',
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'CREDENTIALS DO NOT MATCH!!',
      });
    }

    // TOKEN CREATED
    // console.log(user);
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET
    );

    // PUTTING TOKEN INSIDE BROWSER OF USER
    res.cookie('token', token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    // console.log(user)
    return res.json({
      token,
      _id,
      name,
      email,
      role,
    });
  });
};

export const signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'signout route is working well',
  });
};

// protected routes
export const isSignedin = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth',
});

// custom middlewares
export const isAuthenticated = (req, res, next) => {
  const check = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!check) {
    return res.status(403).json({
      error: 'ACCESS DENIED',
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'YOU ARE NOT ADMIN, ACCESS DENIED',
    });
  }
  next();
};
