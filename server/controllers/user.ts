import { Response, NextFunction } from 'express';
import User from '../models/user';
import { OrderSchemas } from '../models/order';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import { Purchases, PurchasesArray } from 'server/interfaces/ProductModel';

const { Order } = OrderSchemas;

export const getUserById = (req: IRequest, res: Response, next: NextFunction, id: string): any => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: 'USER NOT FOUND',
      });
    }
    req.profile = user;
    return next();
  });
};

export const getUser = (req: IRequest, res: Response): any => {
  // TODO password needs to be hiddden
  req.profile.encry_password = undefined;
  req.profile.salt = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  res.json(req.profile);
};

export const updateUser = (req: IRequest, res: Response): any => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    {
      new: true,
      useFindAndModify: false,
      fields: { encry_password: 0, salt: 0, createdAt: 0, updatedAt: 0 },
    },
    (error, user) => {
      if (error) {
        return res.status(400).json({
          error: 'You are not authorized to update this information',
        });
      }
      return res.json(user);
    }
  );
};

export const userPurchaseList = (req: IRequest, res: Response): any => {
  Order.find({ user: req.profile._id })
    .populate('user', '_id name')
    .exec((error, order) => {
      if (error) {
        return res.status(404).json({
          error: 'NO ORDER IN THIS ACCOUNT',
        });
      }
      return res.json(order);
    });
};

export const pushOrderInPurchaseList = (req: IRequest, res: Response, next: NextFunction): any => {
  const purchases: PurchasesArray = [];
  req.body.order.products.forEach((product: Purchases) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // store this in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases } },
    { new: true },
    (error, _result) => {
      if (error) {
        return res.status(400).json({
          error: 'Unable to save purchase list',
        });
      }
      return next();
    }
  );
};
