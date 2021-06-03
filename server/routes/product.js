const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  photo,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedin, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//param routes
router.param("userId", getUserById);
router.param("productId", getProductById);

//Create Route
router.post(
  "/product/create/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  createProduct
);

//Get product routes
router.get("/product/:productId", getProduct);
//for optimisation
router.get("/product/photo/:productId", photo);

//Update product route
router.put("/product/:productId/:userId", updateProduct);

//Delete product route
router.delete("/product/:productId/:userId", deleteProduct);

//get all products
router.get("/products", getAllProducts);

//getting all categories so that user can put his product in one of these categories
router.get("/product/categories", getAllUniqueCategories);

module.exports = router;
