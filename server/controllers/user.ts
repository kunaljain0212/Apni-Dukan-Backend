import { Response, NextFunction } from 'express';
import User from '../models/user';
import { OrderSchemas } from '../models/order';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import { Purchases, PurchasesArray } from 'server/interfaces/ProductModel';

const { Order } = OrderSchemas;

export const getUserById = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
  id: string
): Promise<any> => {
  try {
    const user = await User.findById(id, {
      encry_password: 0,
      salt: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    req.profile = user;
    return next();
  } catch (error) {
    return res.status(400).json({
      error: 'USER NOT FOUND',
    });
  }
};

export const getUser = async (req: IRequest, res: Response): Promise<any> => {
  res.json(req.profile);
};

export const updateUser = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      {
        new: true,
        useFindAndModify: false,
        fields: { encry_password: 0, salt: 0, createdAt: 0, updatedAt: 0 },
      }
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      error: 'You are not authorized to update this information',
    });
  }
};

export const userPurchaseList = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const order = await Order.find({ user: req.profile._id }).populate('user', '_id name');
    return res.json(order);
  } catch (error) {
    return res.status(404).json({
      error: 'NO ORDER IN THIS ACCOUNT',
    });
  }
};

export const pushOrderInPurchaseList = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
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
    await User.findOneAndUpdate({ _id: req.profile._id }, { $push: { purchases } }, { new: true });

    return next();
  } catch (error) {
    return res.status(400).json({
      error: 'Unable to save purchase list',
    });
  }
};
