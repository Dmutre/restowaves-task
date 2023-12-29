'use strict';
/*Сервіс призми. Такий підхід використовується в несті, проте там трошки інший код. Це рішення має місце,
адже воно не потребує постійного створення нових інстансів класу прізми клієнту */
const { PrismaClient } = require('@prisma/client');
const prismaService = new PrismaClient();

module.exports = {
  prismaService
}