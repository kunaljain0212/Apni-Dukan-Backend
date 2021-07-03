import { Document, PopulatedDoc } from 'mongoose';
import { ICategory } from './categoryModel';

interface Photo {
  data: {
    $binary: string;
    $type: string;
  };
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
