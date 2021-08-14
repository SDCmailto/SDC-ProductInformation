import http from 'k6/http'

export let options = {
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 1000, // RPS
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 300,
      maxVUs: 500
    }
  }
}

// GET
export default function () {
  let productId = Math.floor(Math.random() * (10000000 - 1) + 1)
  http.get(`http://127.0.0.1:3001/Information/${productId}`)
}



// // POST
// export default function () {
//   const url = 'http://127.0.0.1:3001/Information/'
//   const payload = JSON.stringify({
//     ASPECT_RATIO: 'aspect_ratio aspect_ratio aspect_ratio',
//     RATING_ID: 1,
//     DIMENSIONS: 'dimensions dimensions dimensions',
//     FORMAT_ID: 2,
//     RUNTIME: 'runtime runtime runtime',
//     RELEASE_DATE: '2021-01-01',
//     CAST_LIST: ['person1', 'person2', 'person3', 'person4'],
//     STUDIO_ID: 3,
//     NUMBER_OF_DISKS: 4
//   })
//   const params = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   }

//   http.post(url, payload, params)
// }