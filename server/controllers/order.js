import { OrderSchemas } from '../models/order';

const { Order } = OrderSchemas;

export const getOrderById = (req, res, next, id) => {
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

export const createOrder = (req, res) => {
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

export const getAllOrders = (req, res) => {
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

export const getOrderStatus = (req, res) => res.json(Order.schema.path('status').enumValues);

export const updateOrderStatus = (req, res) => {
  Order.updateOne({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, data) => {
    if (err) {
      return res.status(400).json({
        err: 'Failed to update status in DB',
      });
    }
    return res.json(data);
  });
};
