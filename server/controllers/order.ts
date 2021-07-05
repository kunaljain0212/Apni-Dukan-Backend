import { Request, Response, NextFunction } from 'express';
import { ISchemaType } from 'server/interfaces/ExtendedMogooseSchemaType';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import { IOrder } from 'server/interfaces/OrderModel';
import { OrderSchemas } from '../models/order';

const { Order } = OrderSchemas;

export const getOrderById = (req: IRequest, res: Response, next: NextFunction, id: string): any => {
  Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: 'NO Order found in DB',
        });
      }
      req.order = order;
      return next();
    });
};

export const createOrder = (req: IRequest, res: Response): any => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, orderData) => {
    if (err) {
      return res.status(400).json({
        err: 'Order not saved in DB',
      });
    }
    return res.json(orderData);
  });
};

export const getAllOrders = (req: Request, res: Response): any => {
  Order.find()
    .populate('user', 'name _id')
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          err: 'NO Orders in DB',
        });
      }
      return res.json(orders);
    });
};

export const getOrderStatus = (req: Request, res: Response): any =>
  res.json((Order.schema.path('status') as ISchemaType).enumValues);

export const updateOrderStatus = (req: Request, res: Response): any => {
  Order.updateOne(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    { new: true },
    (error: any, updatedOrder: IOrder) => {
      if (error) {
        return res.status(400).json({
          err: 'Failed to update status in DB',
        });
      }
      return res.json(updatedOrder);
    }
  );
};
