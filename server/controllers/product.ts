import { Request, Response, NextFunction } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import { IProduct } from 'server/interfaces/ProductModel';
import Product from '../models/product';

export const getProductById = (
  req: IRequest,
  res: Response,
  next: NextFunction,
  id: string
): any => {
  Product.findById(id)
    .populate('category')
    .exec((error, product) => {
      if (error) {
        return res.status(400).json({
          error: 'Product not found in DB',
        });
      }
      req.product = product;
      return next();
    });
};

export const createProduct = (req: Request, res: Response): any => {
  const form = new formidable.IncomingForm();

  // eslint-disable-next-line consistent-return
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: 'Problem creating product!',
      });
    }

    const { name, description, price, stock, category } = fields;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        error: 'Fields can not be empty',
      });
    }

    const product = new Product(fields);
    if (file.photo as formidable.File) {
      if ((file.photo as formidable.File).size > 3000000) {
        return res.status(400).json({
          error: 'File size too big!',
        });
      }
      product.photo.data = fs.readFileSync((file.photo as formidable.File).path);
      product.photo.contentType = (file.photo as formidable.File).type as string;
    }

    product.save((saveError, savedProduct) => {
      if (saveError) {
        return res.status(400).json({
          error: 'Product not saved in DB',
        });
      }
      return res.json(savedProduct);
    });
  });
};

export const getProduct = (req: IRequest, res: Response): any => {
  req.product.photo = undefined;
  return res.json(req.product);
};

export const photo = (req: IRequest, res: Response, next: NextFunction): any => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  return next();
};

export const updateProduct = (req: IRequest, res: Response): any => {
  const form = new formidable.IncomingForm();

  // eslint-disable-next-line consistent-return
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: 'Problem updating product!',
      });
    }

    let { product } = req;
    product = Object.assign(product, fields);
    console.log(product);

    if (file.photo) {
      if ((file.photo as formidable.File).size > 3000000) {
        return res.status(400).json({
          error: 'File size too big!',
        });
      }
      product.photo.data = fs.readFileSync((file.photo as formidable.File).path);
      product.photo.contentType = (file.photo as formidable.File).type;
    }

    product.save((saveError: any, savedProduct: IProduct) => {
      if (saveError) {
        return res.status(400).json({
          error: 'Updation failed in DB',
        });
      }
      return res.json(savedProduct);
    });
  });
};

export const deleteProduct = (req: IRequest, res: Response): any => {
  const { product } = req;
  product.remove((error: any, deletedProduct: IProduct) => {
    if (error) {
      return res.status(400).json({
        error: 'Product not deleted from DB',
      });
    }
    return res.json({
      message: `${deletedProduct.name} deleted from DB`,
    });
  });
};

export const getAllProducts = (req: IRequest, res: Response): any => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : '_id';

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({
          error: 'No products found',
        });
      }
      return res.json(products);
    });
};

export const updateInventory = (req: IRequest, res: Response, next: NextFunction): any => {
  const myOperations = req.body.order.products.map((prod: any) => ({
    updateOne: {
      filter: { _id: prod._id },
      update: { $inc: { stock: -prod.count, sold: +prod.count } },
    },
  }));

  Product.bulkWrite(myOperations, {}, (error, updatedInventory) => {
    if (error) {
      return res.status(400).json({
        error: 'Inventory updation failed',
      });
    }
    console.log(updatedInventory);
    return next();
  });
};

export const getAllUniqueCategories = (req: Request, res: Response): any => {
  // console.log("came in")
  Product.distinct('category', {}, (erroror, category) => {
    if (erroror) {
      return res.status(400).json({
        erroror: 'No category found for product',
      });
    }
    return res.json(category);
  });
};
