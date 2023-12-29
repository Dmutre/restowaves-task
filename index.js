'use strict';

require('dotenv').config();
const express = require('express');
const { configurateDataWithSheet } = require('./sheets/sheetDB');
const { router } = require('./routes/productRouter');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(router);

/*Конфігуруємо  нашу таблицю і запускаємо наш сервер*/
async function start() {
  await configurateDataWithSheet();
  const interval = 60 * 60 * 1000;
  setInterval(configurateDataWithSheet, interval);//Встановлюємо інтервал для нашої конфігурації таблиці з БД
  app.listen(PORT, () => console.log(`Server sterted on port ${PORT}`));
}

start();

