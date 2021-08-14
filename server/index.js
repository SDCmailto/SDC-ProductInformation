// const newrelic = require('newrelic')
const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const db = require('../database/index.js');
const cors = require('cors');
const shrinkRay = require('shrink-ray-current');
const bodyParser = require('body-parser');
const redis = require("redis");
const client = redis.createClient();

app.options('*', cors());
app.get('*', cors());
app.use(cors());
app.use(shrinkRay());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

client.on("error", function(error) {
  console.error(error);
});

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
// app.get('/:productId', function (req, res) {
//   if (req.params.productId === 'Information') {
//     return db.returnData('1')
//       .then((currentDVD) => {
//         console.log('Retrieved specific DVD', currentDVD);
//         res.json(currentDVD);
//       })
//       .catch((error) => {
//         console.log('Error retrieving specific DVD', error);
//       });
//   }
//   res.sendFile(path.join(__dirname, '..', 'public/index.html'));
// });


//API Call for specific product ID
// app.get('/Information/:productId', function (req, res) {
//   console.log('API CALL Specific DVD Request:', req.params.productId);

//   if (req.params.productId) {
//     return db.returnData(req.params.productId)
//       .then((currentDVD) => {
//         console.log('Retrieved specific DVD', currentDVD);
//         res.json(currentDVD);
//       })
//       .catch((error) => {
//         console.log('Error retrieving specific DVD', error);
//       });
//   } else {
//     return db.returnData('1')
//       .then((currentDVD) => {
//         console.log('Retrieved specific DVD', currentDVD);
//         res.json(currentDVD);
//       })
//       .catch((error) => {
//         console.log('Error retrieving specific DVD', error);
//       });
//   }
// });

// information.js
app.get('/information.js', (req, res) => {
  // res.send('/information.js')
  res.send('https://sdc-productinformation.s3.us-east-2.amazonaws.com/information.js')
})

// CREATE
app.post('/Information', function (req, res) {
  console.log('CREATE route')
  const product = {
    ASPECT_RATIO: req.body.ASPECT_RATIO,
    RATING_ID: req.body.RATING_ID,
    DIMENSIONS: req.body.DIMENSIONS,
    FORMAT_ID: req.body.FORMAT_ID,
    RUNTIME: req.body.RUNTIME,
    RELEASE_DATE: req.body.RELEASE_DATE,
    CAST_LIST: req.body.CAST_LIST,
    STUDIO_ID: req.body.STUDIO_ID,
    NUMBER_OF_DISKS: req.body.NUMBER_OF_DISKS
  };

  // console.log('product: ', product)

  return db.productCreate(product)
    .then(result => {
      if (result.error) {
        res.status(404).json({ error: result.error })
      }
      console.log('Create success')
      res.json(result);
    })
    .catch(err => {
      console.log('Error in create route', err)
      res.status(404).json({ error: 'error in productCreate' })
    });
});

// READ
app.get('/Information/:productId', function (req, res) {
  console.log('READ route:', req.params.productId);

  try {
    client.get(req.params.productId, async (err, result) => {
      if (err) throw err;

      if (result) {
        console.log('retrieved from cache: ', result)
        res.send(JSON.parse(result))
      } else {
        db.productRead(req.params.productId)
        .then(result => {
          if (result.error) {
            res.status(404).json({ error: result.error })
          }
          client.setex(req.params.productId, 1, JSON.stringify(result))
          console.log('Read success', result);
          res.json(result);
        })
        .catch((error) => {
          console.log('Error retrieving specific DVD', error);
          res.status(404).json({ error: 'error in ProductRead' })
        });
      }
    })
  } catch(err) {
    res.status(500).json({ error: 'error in READ route' })
  }
});

// UPDATE
app.put('/Information/:productId', function (req, res) {
  console.log('UPDATE route')

  const product = {
    PRODUCT_ID: req.params.productId,
    ASPECT_RATIO: req.body.ASPECT_RATIO,
    RATING_ID: req.body.RATING_ID,
    DIMENSIONS: req.body.DIMENSIONS,
    FORMAT_ID: req.body.FORMAT_ID,
    RUNTIME: req.body.RUNTIME,
    RELEASE_DATE: req.body.RELEASE_DATE,
    CAST_LIST: req.body.CAST_LIST,
    STUDIO_ID: req.body.STUDIO_ID,
    NUMBER_OF_DISKS: req.body.NUMBER_OF_DISKS
  };

  return db.productUpdate(product)
    .then(result => {
      if (result.error) {
        res.status(404).json({ error: result.error })
      }
      console.log('Update successful', result);
      res.json(result);
    })
    .catch(err => {
      console.log('Error in create route')
    });
});

// DELETE
app.delete('/Information/:productId', function (req, res) {
  console.log('DELETE route', req.params.productId)

  return db.productDelete(req.params.productId)
    .then(result => {
      if (result.error) {
        res.status(404).json({ error: result.error })
      }
      console.log('Delete successful', result);
      res.json(result);
    })
    .catch(err => {
      console.log('Error in delete route: ', err)
    });
});

app.listen(port, () => {
  console.log(`Server now listening at http://localhost:${port}`);
});