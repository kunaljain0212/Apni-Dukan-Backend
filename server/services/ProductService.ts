import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';
import formidable from 'formidable';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import Product from '../models/product';

class ProductsService {
  async getProductById(id: string): Promise<any> {
    return Product.findById(id).populate('category');
  }

  async createProduct(req: Request): Promise<any> {
    const form = new formidable.IncomingForm();

    form.parse(req, (error, fields, file) => {
      if (error) {
        throw {
          statusCode: 400,
          message: 'Problem creating product!',
        };
      }

      const { name, description, price, stock, category } = fields;

      if (!name || !description || !price || !stock || !category) {
        throw {
          statusCode: 400,
          message: 'Fields can not be empty!',
        };
      }
      if (file.photo as formidable.File) {
        if ((file.photo as formidable.File).size > 3000000) {
          throw {
            statusCode: 400,
            message: 'File size too big!',
          };
        }
        cloudinary.v2.uploader.upload(
          (file.photo as formidable.File).path,
          { quality: '40' },
          async (cloudError, result) => {
            if (cloudError) {
              throw {
                statusCode: 400,
                message: 'Product not saved in DB!',
              };
            }
            // eslint-disable-next-line no-param-reassign
            fields.photo = result?.secure_url as string;
            const product = await Product.create(fields);
            return product;
          }
        );
      }
    });
  }

  async updateProduct(req: IRequest) {
    const form = new formidable.IncomingForm();

    form.parse(req, (error, fields, file) => {
      if (error) {
        throw {
          statusCode: 400,
          message: 'Problem updating product!',
        };
      }

      let { product } = req;
      product = Object.assign(product, fields);

      if (file.photo as formidable.File) {
        if ((file.photo as formidable.File).size > 3000000) {
          throw {
            statusCode: 400,
            message: 'File size too big!',
          };
        }
        cloudinary.v2.uploader.upload(
          (file.photo as formidable.File).path,
          { quality: '40' },
          async (cloudError, result) => {
            if (cloudError) {
              throw {
                statusCode: 400,
                message: 'Product not saved in DB!',
              };
            }
            // eslint-disable-next-line no-param-reassign
            product.photo = result?.secure_url as string;
            const savedProduct = await product.save();
            return savedProduct;
          }
        );
      }
    });
  }

  async getAllProducts(limit: any, sortBy: any): Promise<any> {
    const l = limit ? parseInt(limit as string, 10) : 8;
    const sort = sortBy ? sortBy : '_id';
    const products = await Product.find()
      .populate('category')
      .sort([[sort, 'asc']])
      .limit(l);
    if (products.length === 0) {
      throw new Error('No products found');
    }
    return products;
  }

  async updateInventory(products: any): Promise<any> {
    const myOperations = products.map((prod: any) => ({
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    }));
    Product.bulkWrite(myOperations, {});
  }

  async getAllUniqueCategories(): Promise<any> {
    return Product.distinct('category', {});
  }
}

export default new ProductsService();
