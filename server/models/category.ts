import mongoose from 'mongoose';
import { ICategory } from 'server/interfaces/CategoryModel';

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema);
