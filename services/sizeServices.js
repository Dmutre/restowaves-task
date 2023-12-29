'use strict';

const { prismaService } = require("./prismaService");

const sizeService = {
  async getSizesOfProduct(productId) {
    const sizes = await prismaService.productSizes.findMany({
      where: {productId: productId},
    });
    return sizes;
  }
}

module.exports = {
  sizeService
}