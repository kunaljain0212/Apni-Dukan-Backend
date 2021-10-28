import { Response, NextFunction } from 'express';
import { IRequest } from 'server/interfaces/ExtendedRequest';

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
