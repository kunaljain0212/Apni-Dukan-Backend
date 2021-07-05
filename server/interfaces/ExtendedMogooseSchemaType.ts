import { SchemaType } from 'mongoose';

export interface ISchemaType extends SchemaType {
  [key: string]: any;
}
