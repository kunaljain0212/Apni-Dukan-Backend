import { Document, PopulatedDoc } from 'mongoose';
import { IProductCartSchema } from './productCartModel';
import { IUser } from './userModel';

export interface IOrder {
  products: IProductCartSchema[];
  amount: number;
  address: string;
  status: string;
  updated: string;
  user: PopulatedDoc<IUser & Document>;
}
