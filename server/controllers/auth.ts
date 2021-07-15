import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import User from '../models/user';
import { IRequest } from 'server/interfaces/ExtendedRequest';

// eslint-disable-next-line consistent-return
export const signup = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    return res.json({
      name: savedUser.name,
      email: savedUser.email,
      id: savedUser._id,
    });
  } catch (error) {
    return res.status(400).json({
      error:
        'NOT able to save the user in database. Potential reason could be - Email already exists',
    });
  }
};

// eslint-disable-next-line consistent-return
export const signin = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw {
        statusCode: 422,
        message: errors.array()[0].msg,
      };
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw {
        statusCode: 400,
        message: 'USER not found!',
      };
    }

    if (!user.authenticate(req.body.password)) {
      throw {
        statusCode: 401,
        message: 'CREDENTIALS DO NOT MATCH!',
      };
    }

    // TOKEN CREATED
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET || ''
    );

    // PUTTING TOKEN INSIDE BROWSER OF USER
    res.cookie('token', token, { expires: new Date() });

    const { _id, name, email, role } = user;
    return res.json({
      token,
      _id,
      name,
      email,
      role,
    });
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(400).json({ error: 'Database error occured' });
  }
};

export const signout = async (req: Request, res: Response): Promise<any> => {
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
