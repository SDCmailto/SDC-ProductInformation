const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Information', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error Connecting Database'));
db.once('open', function() {
  console.log('Database Connected');
});

const fakeSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true
  },
  aspectRatio: String,
  rating: String,
  dimensions: String,
  format: String,
  runTime: String,
  releaseDate: Date,
  cast: Array,
  studio: String,
  numberOfDisks: Number,
});


let Information = mongoose.model('Information', fakeSchema);

let returnData = (id) => {
  return Information.findOne({productId: id}).exec();
};

let createInformation = (information) => {
  return Information.insertMany([information]).exec();
};

 let updateInformation = (id, information) => {
  return Information.findOneAndUpdate({productId: id}, {
    $set: information
  }).exec();
};

let deleteInformation = (id) => {
  return Information.deleteOne({
    productId: id
  }).exec();
};

module.exports.returnData = returnData;
module.exports.Information = Information;
module.exports.createInformation = createInformation;
module.exports.updateInformation = updateInformation;
module.exports.deleteInformation = deleteInformation;
