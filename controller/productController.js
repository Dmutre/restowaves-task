'use strict';

const { modelService } = require("../services/modelService");
const { prismaService } = require("../services/prismaService");
const { sizeService } = require("../services/sizeServices");

const productController = {
  async getAll(req, res) {
    const products = await prismaService.product.findMany();
    res.send(products); 
  },

  /*В цьому методі я вирішив також повертати і назву моделі і доступні розміри. Це логічно, якщо ми хочемо
  отримати дані про певний товар, то, напевно, хочемо отримати повну інформацію. Невеликий бонус*/
  async getById(req, res) {
    const id = parseInt(req.params.id);
    const product = await prismaService.product.findUnique({
      where: {id: id}
    });
    product.model = await modelService.getById(product.modelId);
    product.sizes = await sizeService.getSizesOfProduct(product.id);
    res.send(product);
  },

  /*Метод працює правильно і відображає всі продукти взуття з таким доступним розміром */
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
  },

  async getByBrand(req, res) {
    const brandId = Number(req.params.brandId);
    const models = await prismaService.model.findMany({
      where: {brandId: brandId}
    });

    console.log(models);

    const products = await Promise.all(models.map(async (model) => {
      const modelProducts = await prismaService.product.findMany({
        where: { modelId: model.id }
      });
      return { model, products: modelProducts };
    }));

    return res.send(products);
  },

  async getByCategory(req, res) {
    const categoryId = Number(req.params.categoryId);
    const models = await prismaService.model.findMany({
      where: {categoryId: categoryId}
    });
    const products = await Promise.all(models.map(async (model) => {
      const modelProducts = await prismaService.product.findMany({
        where: { modelId: model.id }
      });
      return { model, products: modelProducts };
    }));
    return res.send(products);
  },
}

module.exports = { 
  productController
}