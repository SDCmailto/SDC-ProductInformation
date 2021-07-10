const pg = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env')});
const faker = require('faker');
const fs = require('fs');

const client = new pg.Client();

const executeSchema = async function() {
  const statements = [
    'DROP TABLE IF EXISTS PRODUCT;',
    'DROP TABLE IF EXISTS STUDIO;',
    'DROP TABLE IF EXISTS RATING;',
    'DROP TABLE IF EXISTS FORMAT;',

    `CREATE TABLE RATING (
      RATING_ID SERIAL PRIMARY KEY,
      RATING_NAME VARCHAR(5) NOT NULL UNIQUE
    );`,

    `CREATE TABLE FORMAT (
      FORMAT_ID SERIAL PRIMARY KEY,
      FORMAT_NAME VARCHAR(20) NOT NULL UNIQUE
    );`,

    `CREATE TABLE STUDIO (
      STUDIO_ID SERIAL PRIMARY KEY,
      STUDIO_NAME VARCHAR(255) NOT NULL UNIQUE
    );`,

    `CREATE TABLE PRODUCT (
      PRODUCT_ID SERIAL PRIMARY KEY,
      ASPECT_RATIO VARCHAR(255),
      RATING_ID INT REFERENCES RATING(RATING_ID),
      DIMENSIONS VARCHAR(255),
      FORMAT_ID INT REFERENCES FORMAT(FORMAT_ID),
      RUNTIME VARCHAR(255),
      RELEASE_DATE DATE,
      NUMBER_OF_DISKS INT,
      CAST_LIST JSONB,
      STUDIO_ID INT REFERENCES STUDIO(STUDIO_ID)
    );`
  ];

  for (let statement of statements) {
    try {
      const res = await client.query(statement);
      console.log(`success executeSchema, ${statement.split('(')[0]}: `, res);
    } catch (err) {
      console.log(`error executeSchema, ${statement.split('(')[0]}: `, err);
    }
  }
};

const seedRating = async function() {
  const tableName = 'RATING';
  const columnName = 'RATING_NAME';
  const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  const values = [];
  ratings.forEach(rating => values.push(`('${rating}')`));
  const query = `INSERT INTO ${tableName} (${columnName}) VALUES ${values.join(',')};`

  try {
    const res = await client.query(query);
    console.log('seedRating success: ', res);
  } catch (err) {
    console.log('seedRating error: ', err);
  }
};

const seedFormat = async function() {
  const tableName = 'FORMAT';
  const columnName = 'FORMAT_NAME';
  const formats = ['Color', 'NTSC', 'Subtitled', 'Widescreen', 'Multiple Formats', 'Full Screen', 'Dolby', 'Dubbed'];
  const values = [];
  formats.forEach(format => values.push(`('${format}')`));
  const query = `INSERT INTO ${tableName} (${columnName}) VALUES ${values.join(',')};`

  try {
    const res = await client.query(query);
    console.log('seedFormat success: ', res);
  } catch (err) {
    console.log('seedFormat error: ', err);
  }
};

const seedStudio = async function() {
  const tableName = 'STUDIO';
  const columnName = 'STUDIO_NAME';
  const studios = {};
  let name;
  for (let i = 0; i < 2500000; i++) {
    name = faker.name.findName();
    if (!studios[name]) {
      studios[name] = true;
    }
  }

  let values = [];
  Object.keys(studios).forEach(value => values.push(`('${value.replace('\'', '\'\'')}')`));

  const query = `INSERT INTO ${tableName} (${columnName}) VALUES ${values.join(',')};`

  try {
    const res = await client.query(query);
    console.log('seedStudio success: ', res);
  } catch (err) {
    console.log('seedStudio error: ', err);
  }
};

// write 10MM records to CSV, then COPY postgres
const seedProduct = async function() {
  const ratingCountRes = await client.query('select count(*) as rowcount from rating;');
  const formatCountRes = await client.query('select count(*) as rowcount from format;');
  const studioCountRes = await client.query('select count(*) as rowcount from studio;');

  const ratingCount = parseInt(ratingCountRes.rows[0].rowcount);
  const formatCount = parseInt(formatCountRes.rows[0].rowcount);
  const studioCount = parseInt(studioCountRes.rows[0].rowcount);

  const productCSVPath = '/Users/wylie/Documents/coding/hackreactor/sdc/SDC-ProductInformation/database/product.csv';

  let writeStream = fs.createWriteStream(productCSVPath);

  for (let i = 0; i < 10000000; i++) {
    let castList = [];
    for (let j = 0; j < 4; j++) {
      castList.push(faker.name.findName());
    }
    let ASPECT_RATIO = (faker.datatype.number(5)) + ':' + (faker.datatype.number(5));
    let RATING_ID = Math.floor(Math.random() * ratingCount + 1);
    let DIMENSIONS = (faker.datatype.number(10)) + ' x ' + (faker.datatype.number(5)) + ' x ' + (faker.datatype.number(2)) + ' Inches';
    let FORMAT_ID = Math.floor(Math.random() * formatCount + 1);
    let RUNTIME = Math.floor(Math.random() * 4) + ' hours and ' + Math.floor(Math.random() * 59) + ' minutes';
    let RELEASE_DATE = faker.date.between('1995-01-01', '2022-01-01');
    let NUMBER_OF_DISKS = faker.datatype.number(3);
    let STUDIO_ID = Math.floor(Math.random() * studioCount + 1);

    console.log(`writing record #${i}`)

    writeStream.write(`"${ASPECT_RATIO}", ${RATING_ID}, "${DIMENSIONS}", ${FORMAT_ID}, "${RUNTIME}", "${RELEASE_DATE.getFullYear() + '-' + (RELEASE_DATE.getMonth() + 1).toString().padStart(2, '0') + '-' + (RELEASE_DATE.getDay() + 1).toString().padStart(2, '0')}", ${NUMBER_OF_DISKS}, "${JSON.stringify({ data: castList }).replace(/"/g, '""')}", ${STUDIO_ID}\n`);
  }

  writeStream.on('finish', () => {
    console.log('writing to file finished');
  });
  writeStream.end();

  // having some trouble closing the writeStream
  await new Promise(r => setTimeout(r, 3000));

  const tableName = 'PRODUCT';
  const columnNames = ['ASPECT_RATIO', 'RATING_ID', 'DIMENSIONS', 'FORMAT_ID', 'RUNTIME', 'RELEASE_DATE', 'NUMBER_OF_DISKS', 'CAST_LIST', 'STUDIO_ID'];

  try {
    const query = `COPY ${tableName} (${columnNames.join(', ')}) FROM '${productCSVPath}' DELIMITER ',' csv;`

    console.log(query);

    const res = await client.query(query);
    console.log('seedProduct success: ', res);
  } catch (err) {
    console.log('seedProduct error: ', err);
  }
};

const seedDB = async function() {
  await client.connect();
  await executeSchema();
  await seedRating();
  await seedFormat();
  await seedStudio();
  await seedProduct();
  await client.end();
}

seedDB();