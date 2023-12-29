'use strict';

const { prismaService } = require("./prismaService");
/*Сервіс для розмірів. Такі речі часто називають репозиторіямиЮ проте я не захотів ще звідси
виділяти ще більше коду, бо він і так достатньо декомпозований. Тому залишив це в одній папці */
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