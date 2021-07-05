import { Request, Response, NextFunction } from 'express';
import { ICategory } from 'server/interfaces/CategoryModel';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import Category from '../models/category';

// param routes
export const getCategoryById = (
  req: IRequest,
  res: Response,
  next: NextFunction,
  id: string
): any => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        err: 'Category not found in DB',
      });
    }
    req.category = cate;
    return next();
  });
};

// Create Route
export const createCategory = (req: Request, res: Response): any => {
  const category = new Category(req.body);
  category.save((error: any, savedCategory: ICategory) => {
    if (error) {
      return res.status(400).json({
        error: 'NOT able to save category',
      });
    }
    return res.status(200).json({ category: savedCategory });
  });
};

// Get category routes
export const getCategory = (req: IRequest, res: Response): any => res.json(req.category);

export const getAllCategories = (req: Request, res: Response): any => {
  Category.find().exec((err: any, categories: ICategory[]) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.json(categories);
  });
};

// Update category route
export const updateCategory = (req: IRequest, res: Response): any => {
  const { category } = req;
  category.name = req.body.name;
  category.save((error: any, updatedCategory: ICategory) => {
    if (error) {
      return res.status(400).json({
        err: 'FAILED TO UPDATE CATEGORY',
      });
    }
    return res.json(updatedCategory);
  });
};

// Delete category route
export const removeCategory = (req: IRequest, res: Response): any => {
  const { category } = req;
  category.remove((error: any, removedCategory: ICategory) => {
    if (error) {
      return res.status(400).json({
        err: 'FAILED TO REMOVE CATEGORY',
      });
    }
    return res.json({
      message: `${removedCategory.name} SUCCESSFULLY DELETED`,
    });
  });
};
