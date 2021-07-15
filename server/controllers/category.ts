import { Request, Response, NextFunction } from 'express';
import { ICategory } from 'server/interfaces/CategoryModel';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import Category from '../models/category';

// param routes
export const getCategoryById = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
  id: string
): Promise<any> => {
  try {
    const cate = await Category.findById(id);
    req.category = cate;
    return next();
  } catch (error) {
    return res.status(400).json({
      err: 'Category not found in DB',
    });
  }
};

// Create Route
export const createCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    return res.status(200).json({ category: savedCategory });
  } catch (error) {
    return res.status(400).json({
      error: 'NOT able to save category',
    });
  }
};

// Get category routes
export const getCategory = (req: IRequest, res: Response): any => res.json(req.category);

// Get all categories
export const getAllCategories = async (req: Request, res: Response): Promise<any> => {
  try {
    const categories = await Category.find();
    return res.json(categories);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

// Update category route
export const updateCategory = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const { category } = req;
    category.name = req.body.name;
    const updatedCategory = await category.save();
    return res.json(updatedCategory);
  } catch (error) {
    return res.status(400).json({
      err: 'FAILED TO UPDATE CATEGORY',
    });
  }
};

// Delete category route
export const removeCategory = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const { category } = req;
    const removedCategory = await category.remove();
    return res.json({
      message: `${removedCategory.name} SUCCESSFULLY DELETED`,
    });
  } catch (error) {
    return res.status(400).json({
      err: 'FAILED TO REMOVE CATEGORY',
    });
  }
};
