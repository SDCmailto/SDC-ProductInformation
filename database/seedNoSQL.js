const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env')});
const faker = require('faker');

// create productinformation DB
const createDB = async function() {
  await axios.put(`http://${process.env.CDBUSER}:${process.env.CDBPASS}@127.0.0.1:5984/productinformation`)
  .then(result => console.log('success, create productinformation DB: ', result))
  .catch(err => console.log('error, create productinformation DB: ', err));
};

// create 10MM productinformation documents
const seedDB = async function() {
  let ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  let formats = ['Color', 'NTSC', 'Subtitled', 'Widescreen', 'Multiple Formats', 'Full Screen', 'Dolby', 'Dubbed'];
  let productId = 1;

  // make 500 requests, each creating 20K documents
  for (var i = 0; i < 500; i++) {
    let docs = [];
    for (var j = 0; j < 20000; j++) {
      let castList = [];
      for (let j = 1; j <= 4; j++) {
        castList.push(faker.name.findName());
      }
      let newRecord = {
        productId: productId++,
        aspectRatio: (faker.datatype.number(5)) + ':' + (faker.datatype.number(5)),
        rating: ratings[(Math.floor(Math.random() * 4))],
        dimensions: (faker.datatype.number(10)) + ' x ' + (faker.datatype.number(5)) + ' x ' + (faker.datatype.number(2)) + ' Inches',
        format: formats[(Math.floor(Math.random() * 8))],
        runTime: Math.floor(Math.random() * 4) + ' hours and ' + Math.floor(Math.random() * 59) + ' minutes',
        releaseDate: faker.date.between('1995-01-01', '2022-01-01'),
        cast: castList,
        studio: faker.name.findName(),
        numberOfDisks: faker.datatype.number(3),
      };
      docs.push(newRecord);
    }

    console.log(productId);

    // couchDB bulk create
    await axios.post(`http://${process.env.CDBUSER}:${process.env.CDBPASS}@127.0.0.1:5984/productinformation/_bulk_docs`, { docs })
      .then(result => console.log(`success, create productinformation docs #${i}: `, result))
      .catch(err => console.log(`error, create productinformation docs: #${i}`, err));
  }
};

const indexDB = async function() {
  await axios.post(`http://${process.env.CDBUSER}:${process.env.CDBPASS}@127.0.0.1:5984/productinformation/_index`, {
    index: {
      fields: ['productId']
    },
    name: 'productId-index',
    type: 'json'
  })
  .then(result => console.log(`success, create productId index: `, result))
  .catch(err => console.log(`error, create productId index: `, err));
}

const main = async function() {
  await createDB();
  await seedDB();
  await indexDB();
};

main();