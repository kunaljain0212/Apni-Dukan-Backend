import { Request, Response, NextFunction } from 'express';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import Category from '../models/category';
import CategoryService from '../services/CategoryService';
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
    const category = await CategoryService.createCategory(req.body);
    return res.status(200).json({ category });
  } catch (error) {
    return res.status(400).json({
      error: 'NOT able to save category',
    });
  }
};

// Get category routes
export const getCategory = (req: IRequest, res: Response): any => res.json(req.category);

// Get all categories
export const getAllCategories = async (_: Request, res: Response): Promise<any> => {
  try {
    const categories = await CategoryService.getAllCategories();
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
    const category = await CategoryService.updateCategory(req);
    return res.json(category);
  } catch (error) {
    return res.status(400).json({
      err: 'FAILED TO UPDATE CATEGORY',
    });
  }
};

// Delete category route
export const removeCategory = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const category = await CategoryService.removeCategory(req);
    return res.json({
      message: `${category.name} SUCCESSFULLY DELETED`,
    });
  } catch (error) {
    return res.status(400).json({
      err: 'FAILED TO REMOVE CATEGORY',
    });
  }
};
