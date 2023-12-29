'use strict';

require('dotenv').config();
const express = require('express');
const { configurateDataWithSheet } = require('./sheets/sheetDB');
const { router } = require('./routes/productRouter');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(router);

async function start() {
  await configurateDataWithSheet();
  app.listen(PORT, () => console.log(`Server sterted on port ${PORT}`));
}

start();

