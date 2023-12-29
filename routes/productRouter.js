'use strict';

const express = require('express');
const { productController } = require('../controller/productController');
const router = express.Router();
/*Єдиний роутер який у нас є. Він потрібен для отримання даних про товари, які були вказані у завданні */
router.get('/products', productController.getAll);
router.get('/products/:id', productController.getById)
router.get('/products/size/:size', productController.getProductsBySize)

module.exports = {
  router
}