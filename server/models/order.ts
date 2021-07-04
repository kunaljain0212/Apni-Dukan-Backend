import mongoose from 'mongoose';
import { IOrder } from 'server/interfaces/OrderModel';
import { IProductCartSchema } from 'server/interfaces/ProductCartModel';

const ProductCartSchema = new mongoose.Schema({
  product: {
    type: 'ObjectId',
    ref: 'Product',
  },
  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model<IProductCartSchema>('ProductCart', ProductCartSchema);

const OrderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema],
    transaction_id: {},
    amount: {
      type: Number,
    },
    address: String,
    status: {
      type: String,
      default: 'Recieved',
      enum: ['Delivered', 'Shipped', 'Processing', 'Cancelled', 'Recieved'],
    },
    updated: Date,
    user: {
      type: 'ObjectId',
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export const OrderSchemas = { Order, ProductCart };
