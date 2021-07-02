const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const db = require('../database/index.js');
const cors = require('cors');
const shrinkRay = require('shrink-ray-current');
const bodyParser = require('body-parser');


app.options('*', cors());
app.get('*', cors());
app.use(cors());
app.use(shrinkRay());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('*/dp/:productId', (req, res) => {
  res.sendFile(path.join(__dirname, '/../public/index.html'));
});

//Specific Product Id Fetcher
app.get('/:productId', function (req, res) {
  if (req.params.productId === 'Information') {
    return db.returnData('1')
      .then((currentDVD) => {
        console.log('Retrieved specific DVD', currentDVD);
        res.json(currentDVD);
      })
      .catch((error) => {
        console.log('Error retrieving specific DVD', error);
      });
  }
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});


//API Call for specific product ID
app.get('/Information/:productId', function (req, res) {
  console.log('API CALL Specific DVD Request:', req.params.productId);

  if (req.params.productId) {
    return db.returnData(req.params.productId)
      .then((currentDVD) => {
        console.log('Retrieved specific DVD', currentDVD);
        res.json(currentDVD);
      })
      .catch((error) => {
        console.log('Error retrieving specific DVD', error);
      });
  } else {
    return db.returnData('1')
      .then((currentDVD) => {
        console.log('Retrieved specific DVD', currentDVD);
        res.json(currentDVD);
      })
      .catch((error) => {
        console.log('Error retrieving specific DVD', error);
      });
  }
});

// CREATE
app.post('/Information/', function (req, res) {
  console.log('CREATE route')
  const product = {
    productId: req.body.productId,
    aspectRatio: req.body.aspectRatio,
    rating: req.body.rating,
    dimensions: req.body.dimensions,
    format: req.body.format,
    runTime: req.body.runTime,
    releaseDate: req.body.releaseDate,
    cast: req.body.cast,
    studio: req.body.studio,
    numberOfDisks: req.body.numberOfDisks
  };

  console.log('product: ', product)

  return db.createInformation(product)
    .then(result => {
      console.log('Create successful');
      res.send(result);
    })
    .catch(err => {
      console.log('Error in create route')
    });
});

// UPDATE
app.put('/Information/:productId', function (req, res) {
  console.log('UPDATE route')

  console.log('req.body: ', req.body)

  return db.updateInformation(req.params.productId, req.body)
    .then(result => {
      console.log('Update successful');
      res.send(result);
    })
    .catch(err => {
      console.log('Error in create route')
    });
});

// DELETE
app.delete('/Information/:productId', function (req, res) {
  console.log('DELETE route')

  return db.deleteInformation(req.params.productId)
    .then(result => {
      console.log('Delete successful');
      res.send('Delete successful: ', result);
    })
    .catch(err => {
      console.log('Error in delete route: ', err)
      res.send('Error in delete route: ', err);
    });
});

app.listen(port, () => {
  console.log(`Server now listening at http://localhost:${port}`);
});