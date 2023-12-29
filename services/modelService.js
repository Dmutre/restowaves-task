'use strict';

const { prismaService } = require("./prismaService");
/*Сервіс наших поделей */
const modelService = {
  async getById(id) {
    const model = await prismaService.model.findUnique({
      where: {id: id}
    });
    return model;
  }
}

module.exports = {
  modelService
}