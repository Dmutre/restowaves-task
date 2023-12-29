'use strict';

/* Для отримання даних з онлайн таблиці я використав сервіси Google Cloud і пакет 
googleapis*/
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const sheetConfig = require('../config/sheetConfig.json');
const { configurateModelsDB, configurateProductsDB } = require('../config/dbConfigurator');
//Через спеціфічність таблиці, я також використовував алфавіт
const { alpabet } = require('../utils/alphabet');

/*Наші важливі зміні. apiKey- це шлях з цього файлу до файлів з секретами, тобто ключами для 
використання Google sheet API */
const apiKey = process.env.GOOGLE_APPLICATION_CREDENTIAL;
const sheetId = process.env.SHEED_ID;
const credentials = require(apiKey);
/*Виділив авторизацію до нашої таблиці */
const auth = new GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });
/*Для отримання моделей я зробив окрему функцію, адже вона має трохи інший механізм роботи
ніж функція для отримання певних клітинок */
async function getSheetTitles() {

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const sheetsInfo = response.data.sheets;
    const sheetTitles = sheetsInfo.map(sheet => sheet.properties.title);

    return sheetTitles;
  } catch (error) {
    console.error('Error retrieving sheet titles:', error.message);
  }
}
/*Функція для отримання клітинок у певному діапазоні */
async function getGoogleSheetData(range) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const values = response.data.values;
    return values;
  } catch (error) {
    console.error('Error retrieving data:', error.message);
  }
}
/*Досить специфічна функція для такого ж специфічного завдання. Через потребу у переносі даних
з онлайн таблиці, де дані йдуть не зверху вниз, а зліва направо я вирішив рахувати кількість
товарів у таблиці (вони можуть бути в діапазоні від А до Z), щоб потім навпомацки не знаходити
де лежать наші товари, а одразу отримувати їх кількість */
async function getProductsCount(model) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${model}!B4:Z4`,
    });

    const values = response.data.values;

    if (!values || values.length === 0) {
      console.log('No data found.');
      return 0;
    }

    const nonEmptyFieldsCount = values[0].filter(value => value !== '').length;

    return nonEmptyFieldsCount;
  } catch (error) {
    console.error('Error retrieving data from Google Sheets:', error.message);
    throw error;
  }
}
/*Конфігурація моделей винесена в окрему функцію, бо вона має посилатися на назви листів, а не 
зміст клітинок. Ця функція відслідковує появу нових таблиць */
async function condigurModels() {
  const models = await getSheetTitles();
  configurateModelsDB(models);
  return models;
}
/*Конфігурація продуктів з онлайн таблиці передає одразу дані про товар і про його розміри.
Я намагався зробити таке рішення, щоб таблиця могла дійсно відслідковувати нові товари. Для цього
потрібно тримати її певну структуру. Проте інколи може бути таке, що дані змінять своє положення,
для цього я створив sheetConfig у папці config, де ми приблизно описуємо програмі нашу таблицю.
Більшість таких моментів викликані нестандартим поданням даних в таблиці, до яких я намагався 
підлаштуватися */
async function configurProducts(model) {
  const pos = sheetConfig.dataPositions;
  const productCount = await getProductsCount(model);
  const range = `${model}!B${pos.name}:${alpabet[productCount]}${pos.lowestData}`;
  const data = await getGoogleSheetData(range);
  for(let i = 0; i < productCount; i++) {
    const product = {
      name: data[0][i],
      price: Number(data[1][i]),
      article: data[2][i],
      sizes: {
        "36": data[4][i],
        "37": data[5][i],
        "38": data[6][i],
        "39": data[7][i],
        "40": data[8][i],
        "41": data[9][i],
        "42": data[10][i],
        "43": data[11][i],
        "44": data[12][i],
        "45": data[13][i],
        "46": data[14][i],
      }
    }
    configurateProductsDB(product, model);
  }
  console.log(data);
}
/*Головна функція, яку ми виносимо звідси і викликаємо для первинних і подальщих конфігурацій таблиці з БД */
async function configurateDataWithSheet() {
  const models = await condigurModels();
  for(const model of models) {
    configurProducts(model);
  }
}

module.exports = {
  configurateDataWithSheet
};