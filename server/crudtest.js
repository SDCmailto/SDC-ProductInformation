const axios = require('axios');



// CREATE
// axios.post('http://localhost:3001/Information/Create', {
//   productId: '200',
//   aspectRatio: '4:2',
//   rating: 'G',
//   dimensions: '3 x 5 x 1 Inches',
//   format: 'NTSC',
//   runTime: '2 hours and 12 minutes',
//   releaseDate: '2021-01-01',
//   cast: ['Wylie Zhao'],
//   studio: 'Marvel Studios',
//   numberOfDisks: 2
// })
// .then(result => {
//   console.log(result);
// })
// .catch(err => {
//   console.log(err);
// });

// UPDATE
// axios.put('http://localhost:3001/Information/Update/200', {
  // aspectRatio: '4:2',
  // rating: 'G',
  // dimensions: '3 x 5 x 1 Inches',
  // format: 'NTSC',
  // runTime: '2 hours and 12 minutes',
  // releaseDate: '2021-01-01',
  // cast: ['Wylie Zhao'],
  // studio: 'Marvel Studios',
//   numberOfDisks: 999
// })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// DELETE
// axios.delete('http://localhost:3001/Information/Delete/200')
// .then(result => {
//   console.log(result);
// })
// .catch(err => {
//   console.log(err);
// });

// READ
// axios.get('http://localhost:3001/Information/200')
//   .then(result => {
//     console.log(result.data);
//   })
//   .catch(err => {
//     console.log(err);
//   });