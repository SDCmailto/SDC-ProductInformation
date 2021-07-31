const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env')});

const pool = new Pool();

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// CREATE
productCreate = (product) => {
  return pool
    .query(`INSERT INTO PRODUCT (ASPECT_RATIO, RATING_ID, DIMENSIONS, FORMAT_ID, RUNTIME, RELEASE_DATE, NUMBER_OF_DISKS, CAST_LIST, STUDIO_ID) VALUES ('${product.ASPECT_RATIO}', ${product.RATING_ID}, '${product.DIMENSIONS}', ${product.FORMAT_ID}, '${product.RUNTIME}', '${product.RELEASE_DATE}', ${product.NUMBER_OF_DISKS}, '${JSON.stringify({ data: product.CAST_LIST })}', ${product.STUDIO_ID})`)
    .then(res => {
      return Promise.resolve({ success: `CREATE ${res.rowCount}` })
    })
    .catch(err => {
      return Promise.resolve({ error: err.stack })
    })
}

// READ
productRead = (product_id) => {
  return pool
    .query(`SELECT PRODUCT_ID, ASPECT_RATIO, RATING_NAME, DIMENSIONS, FORMAT_NAME, RUNTIME, RELEASE_DATE, NUMBER_OF_DISKS, CAST_LIST, STUDIO_NAME FROM PRODUCT A INNER JOIN RATING B ON A.RATING_ID = B.RATING_ID INNER JOIN FORMAT C ON A.FORMAT_ID = C.FORMAT_ID INNER JOIN STUDIO D ON A.STUDIO_ID = D.STUDIO_ID WHERE PRODUCT_ID = ${product_id}`)
    .then(res => {
      if (res.rowCount === 0) {
        throw { stack: 'Invalid PRODUCT_ID' }
      }
      console.log(res)
      return Promise.resolve(res.rows[0])
    })
    .catch(err => {
      return Promise.resolve({ error: err.stack })
    })
}

// UPDATE
productUpdate = (product) => {
  return pool
    .query(`UPDATE PRODUCT SET ASPECT_RATIO = '${product.ASPECT_RATIO}', RATING_ID = ${product.RATING_ID}, DIMENSIONS = '${product.DIMENSIONS}', FORMAT_ID = ${product.FORMAT_ID}, RUNTIME = '${product.RUNTIME}', RELEASE_DATE = '${product.RELEASE_DATE}', NUMBER_OF_DISKS = ${product.NUMBER_OF_DISKS}, CAST_LIST = jsonb_set(CAST_LIST, '{data}', '${JSON.stringify(product.CAST_LIST)}'), STUDIO_ID = ${product.STUDIO_ID} WHERE PRODUCT_ID = ${product.PRODUCT_ID}`)
    .then(res => {
      if (res.rowCount === 0) {
        throw { stack: 'Invalid PRODUCT_ID' }
      }
      return Promise.resolve({ success: `UPDATE ${res.rowCount}` })
    })
    .catch(err => {
      return Promise.resolve({ error: err.stack })
    })
}

// DELETE
productDelete = (product_id) => {
  return pool
    .query(`DELETE FROM PRODUCT WHERE PRODUCT_ID = ${product_id}`)
    .then(res => {
      if (res.rowCount === 0) {
        throw { stack: 'Invalid PRODUCT_ID' }
      }
      return Promise.resolve({ success: `DELETE ${res.rowCount}`})
    })
    .catch(err => {
      return Promise.resolve({ error: err.stack })
    })
}

module.exports = {
  productCreate,
  productRead,
  productUpdate,
  productDelete
}