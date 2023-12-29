'use strict';

const express = require('express');
const { productController } = require('../controller/productController');
const router = express.Router();

router.get('/products', productController.getAll);
router.get('/products/:id', productController.getById)
router.get('/products/size/:size', productController.getProductsBySize)

module.exports = {
  router
}