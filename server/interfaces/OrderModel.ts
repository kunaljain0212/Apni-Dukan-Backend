import { Document, PopulatedDoc } from 'mongoose';
import { IProductCartSchema } from './ProductCartModel';
import { IUser } from './UserModel';

export interface IOrder {
  products: IProductCartSchema[];
  amount: number;
  address: string;
  status: string;
  updated: string;
  user: PopulatedDoc<IUser & Document>;
}
