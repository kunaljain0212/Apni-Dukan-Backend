import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import expressJwt from 'express-jwt';
import UsersService from '../services/AuthService';

import { google } from 'googleapis';
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.GOOGLE_CLIENT_ID);

// eslint-disable-next-line consistent-return
export const signup = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  try {
    const { name, email, id } = await UsersService.signup(
      req.body.name,
      req.body.lastName,
      req.body.email,
      req.body.password
    );
    return res.json({
      name,
      email,
      id,
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

    const { token, _id, name, email, role } = await UsersService.login(
      req.body.email,
      req.body.password
    );

    // PUTTING TOKEN INSIDE BROWSER OF USER
    res.cookie('token', token, { expires: new Date() });

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

// eslint-disable-next-line consistent-return
export const googleLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { tokenId } = req.body;

    const verify: any = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    var { email, name, picture } = verify.payload;

    var { token, user } = await UsersService.socialLogin(email, name, picture);

    // PUTTING TOKEN INSIDE BROWSER OF USER
    res.cookie('token', token, { expires: new Date() });

    return res.json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(400).json({ error: 'Database error occured' });
  }
};

export const signout = async (_: Request, res: Response): Promise<any> => {
  res.clearCookie('token');
  return res.json({
    message: 'User signed out successfully',
  });
};

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    await UsersService.forgotPassword(email);
    res.status(200).json({ message: 'Password reset mail was sent successfully' });
  } catch (error: any) {
    return res.status(error.status).json({
      err: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    let { email, otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: 'Password does not match!' });
    }
    await UsersService.resetPassword(email, otp, newPassword);
    res.status(200).json({ message: 'Password Reset Successful!' });
  } catch (error: any) {
    return res.status(error.status).json({
      err: error.message,
    });
  }
};
// protected routes
export const isSignedin = expressJwt({
  secret: process.env.SECRET || '',
  userProperty: 'auth',
  algorithms: ['HS256'],
});
