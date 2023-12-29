'use strict';

const { modelService } = require("../services/modelService");
const { prismaService } = require("../services/prismaService");
const { sizeService } = require("../services/sizeServices");

const productController = {
  async getAll(req, res) {
    const products = await prismaService.product.findMany();
    res.send(products); 
  },

  async getById(req, res) {
    const id = parseInt(req.params.id);
    const product = await prismaService.product.findUnique({
      where: {id: id}
    });
    product.model = await modelService.getById(product.modelId);
    product.sizes = await sizeService.getSizesOfProduct(product.id);
    res.send(product);
  },

  async getProductsBySize(req, res) {
    const size = req.params.size;
    const sizes = await prismaService.productSizes.findMany({
      where: {size: size, available: true},
    });
    const products = [];
    for(const size of sizes) {
      const product = await prismaService.product.findUnique({
        where: {id: size.productId}
      });
      products.push(product);
    }
    res.send(products);
  }
}

module.exports = { 
  productController
}