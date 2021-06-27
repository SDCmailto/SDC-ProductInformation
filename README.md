# Project Name

> Amazon DVD Item Page

## Related Projects

  - https://github.com/Zheng-Yi-Sao/ProductInformation
  - https://github.com/Zheng-Yi-Sao/ProductOverview
  - https://github.com/Zheng-Yi-Sao/CustomerReviews
  - https://github.com/Zheng-Yi-Sao/ProductGallery

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Some usage instructions

## Requirements

An `nvmrc` file is included if using [nvm](https  // aspectRatio: '4:2',
  // rating: 'G',
  // dimensions: '3 x 5 x 1 Inches',
  // format: 'NTSC',
  // runTime: '2 hours and 12 minutes',
  // releaseDate: '2021-01-01',
  // cast: ['Wylie Zhao'],
  // studio: 'Marvel Studios',://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```
## CRUD API Routes

localhost:3001

1. Create
```sh
POST (/Information/)
```
Required parameters
| Parameter | Value |
|---|---|
| productId | String |
| aspectRatio | String |
| rating | String |
| dimensions | String |
| format | String |
| runTime | String |
| releaseDate | Date |
| cast | Array |
| studio |  String |
| numberOfDisks | Number |

2. Read 
```sh
GET (/Information/:ProductId)
```

3. Update 
```sh
PUT (/Information/:ProductId)
```

Required parameters
| Parameter | Value |
|---|---|
| productId | String |
| aspectRatio | String |
| rating | String |
| dimensions | String |
| format | String |
| runTime | String |
| releaseDate | Date |
| cast | Array |
| studio |  String |
| numberOfDisks | Number |

4. Delete 
```sh
DELETE (/Information/:ProductId)
```
