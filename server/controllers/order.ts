import { Request, Response, NextFunction } from 'express';
import { ISchemaType } from 'server/interfaces/ExtendedMogooseSchemaType';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import { OrderSchemas } from '../models/order';

const { Order } = OrderSchemas;

export const getOrderById = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
  id: string
): Promise<any> => {
  try {
    const order = await Order.findById(id).populate('products.product', 'name price');
    req.order = order;
    return next();
  } catch (error) {
    return res.status(400).json({
      err: 'NO Order found in DB',
    });
  }
};

export const createOrder = async (req: IRequest, res: Response): Promise<any> => {
  try {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    const orderData = await order.save();
    return res.json(orderData);
  } catch (error) {
    return res.status(400).json({
      err: 'Order not saved in DB',
    });
  }
};

export const getAllOrders = async (_: Request, res: Response): Promise<any> => {
  try {
    const orders = await Order.find().populate('user', 'name _id');
    return res.json(orders);
  } catch (error) {
    return res.status(400).json({
      err: 'NO Orders in DB',
    });
  }
};

export const getOrderStatus = (_: Request, res: Response): any =>
  res.json((Order.schema.path('status') as ISchemaType).enumValues);

export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const updatedOrder = await Order.updateOne(
      { _id: req.body.orderId },
      { $set: { status: req.body.status } },
      { new: true }
    );
    return res.json(updatedOrder);
  } catch (error) {
    return res.status(400).json({
      err: 'Failed to update status in DB',
    });
  }
};
