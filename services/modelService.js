'use strict';

const { prismaService } = require("./prismaService");

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