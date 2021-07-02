const { Information } = require ('./index.js');
const faker = require('faker');

let seedData = () => {
  let information = [];
  console.log('Calling on seedData function');
  let ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  let formats = ['Color', 'NTSC', 'Subtitled', 'Widescreen', 'Multiple Formats', 'Full Screen', 'Dolby', 'Dubbed', 'NTSC'];
  for (let i = 1; i <= 100; i++) {
    let castList = [];
    for (let j = 1; j <= 4; j++) {
      castList.push(faker.name.findName());
    }
    let newRecord = {
      productId: i,
      aspectRatio: (faker.random.number(5)) + ':' + (faker.random.number(5)),
      rating: ratings[(Math.floor(Math.random() * 4))],
      dimensions: (faker.random.number(10)) + ' x ' + (faker.random.number(5)) + ' x ' + (faker.random.number(2)) + ' Inches',
      format: formats[(Math.floor(Math.random() * 8))],
      runTime: Math.floor(Math.random() * 4) + ' hours and ' + Math.floor(Math.random() * 59) + ' minutes',
      releaseDate: faker.date.between('1995-01-01', '2022-01-01'),
      cast: castList,
      studio: faker.name.findName(),
      numberOfDisks: faker.datatype.number(3),
    };
    information.push(newRecord);
  }
  return information;
};

const data = seedData();
console.log(data);

const save = (data) => {
  data.map((record) => {
    let newRecord = new Information(record);
    newRecord.save(function(err, response) {
      if (err) {
        console.log('Error Saving Database: ', err);
      } else {
        console.log('Saved to Database', response);
      }
    });
  });
};

save(data);


