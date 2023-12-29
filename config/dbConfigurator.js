'use strict';

const { PrismaClient } = require("@prisma/client");
const { prismaService } = require("../services/prismaService");
const prisma = new PrismaClient();


async function configurateModelsDB(models) {
  for (const model of models) {
    const modelDB = await prismaService.model.findFirst({
      where: {name: model}
    })
    if (!modelDB) {
      await prismaService.model.create({data: { name: model }});
    }
  }
}

async function configurateProductsDB(product, model) {
  try {
    const modelDB = await prismaService.model.findFirst({ where: { name: model } });
    if (!modelDB) {
      throw new Error('Model is not defined in the database');
    }

    let existingProduct = await prismaService.product.findUnique({
      where: { article: product.article, modelId: modelDB.id },
    });

    if (existingProduct) {
      existingProduct = await prismaService.product.update({
        where: { id: existingProduct.id },
        data: {
          name: product.name,
          price: product.price,
        },
      });
    } else {
      existingProduct = await prismaService.product.create({
        data: {
          name: product.name,
          article: product.article,
          price: product.price,
          modelId: modelDB.id,
        },
      });
    }

    const sizes = Object.keys(product.sizes);
    for (const size of sizes) {
      let isAvailable = false;
      if(product.sizes[size] === '+') isAvailable = true;
      const sizeDB = await prismaService.productSizes.findUnique({
        where: {
          productId_size: {
            productId: existingProduct.id,
            size: size,
          },
        },
      });
    
      if (!sizeDB) {
        await prismaService.productSizes.create({
          data: {
            size: size,
            available: isAvailable,
            productId: existingProduct.id,
          },
        });
      } else {
        await prismaService.productSizes.update({
          where: {
            id: sizeDB.id, 
          },
          data: {
            available: isAvailable,
          },
        });
      }
    }

    console.log(`Product ${existingProduct.name} configured successfully.`);
  } catch (error) {
    console.error('Error configuring products:', error.message);
  }
}

module.exports = {
  configurateModelsDB,
  configurateProductsDB,
};
