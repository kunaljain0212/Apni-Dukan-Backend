import { Document, PopulatedDoc } from 'mongoose';
import { ICategory } from './CategoryModel';

interface Photo {
  data: any;
  contentType: string;
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: PopulatedDoc<ICategory & Document>;
  stock: number;
  sold: number;
  photo: Photo;
}

export interface Purchases {
  _id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  amount: number;
  // eslint-disable-next-line camelcase
  transaction_id: string;
}

export type PurchasesArray = Purchases[];
