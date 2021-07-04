import { Document, PopulatedDoc } from 'mongoose';
import { IProduct } from './ProductModel';

export interface IProductCartSchema {
  product: PopulatedDoc<IProduct & Document>;
  name: string;
  count: number;
  price: number;
}
