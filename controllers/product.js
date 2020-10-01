const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Product not found in DB",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: "Problem creating product!",
      });
    }

    const { name, description, price, stock, category } = fields;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        error: "Fields can not be empty",
      });
    }

    let product = new Product(fields);
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Product not saved in DB",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: "Problem updating product!",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Updation failed in DB",
        });
      }
      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: "Product not deleted from DB",
      });
    }
    res.json({
      message: `${deletedProduct.name} deleted from DB`,
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({
          error: "No products found",
        });
      }
      res.json(products);
    });
};

exports.updateInventory = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: "Inventory updation failed",
      });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  // console.log("came in")
  Product.distinct("category", {}, (erroror, category) => {
    if (erroror) {
      return res.status(400).json({
        erroror: "No category found for product",
      });
    }
    res.json(category);
  });
};
