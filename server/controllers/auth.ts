import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import User from '../models/user';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import { IUser } from 'server/interfaces/UserModel';

// eslint-disable-next-line consistent-return
export const signup = (req: Request, res: Response): any => {
  // console.log("we entered");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, savedUser) => {
    if (err) {
      return res.status(400).json({
        error:
          'NOT able to save the user in database. Potential reason could be - Email already exists',
      });
    }
    return res.json({
      name: savedUser.name,
      email: savedUser.email,
      id: savedUser._id,
    });
  });
};

// eslint-disable-next-line consistent-return
export const signin = (req: Request, res: Response): any => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err: any, user: IUser) => {
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
      process.env.SECRET || ''
    );

    // PUTTING TOKEN INSIDE BROWSER OF USER
    res.cookie('token', token, { expires: new Date() });

    // eslint-disable-next-line no-shadow
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

export const signout = (req: Request, res: Response): any => {
  res.clearCookie('token');
  return res.json({
    message: 'User signed out successfully',
  });
};

// protected routes
export const isSignedin = expressJwt({
  secret: process.env.SECRET || '',
  userProperty: 'auth',
  algorithms: ['HS256'],
});

// custom middlewares
export const isAuthenticated = (req: IRequest, res: Response, next: NextFunction): any => {
  // eslint-disable-next-line eqeqeq
  const check = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!check) {
    return res.status(403).json({
      error: 'ACCESS DENIED',
    });
  }
  return next();
};

export const isAdmin = (req: IRequest, res: Response, next: NextFunction): any => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'YOU ARE NOT ADMIN, ACCESS DENIED',
    });
  }
  return next();
};
