# Smarthalo AUTH middy Middleware

The auth [middy](https://github.com/middyjs/middy) middleware used @smarthalo for microservices.

## How to install

Latest: `npm install ssh://git@bitbucket.org/smart_halo/auth-middleware.git#master`

Or a specific version: `npm install ssh://git@bitbucket.org/smart_halo/auth-middleware.git#1.1.0`


## Basic usage

```js
import { accessTokenValidationMiddleware } from '@smarthalo/auth-middleware';
import middy from '@middy/core';

const dfuHandler = (event, context, callback) => {
  // do stuff with user that have the dfu_allow_write priviledges
  // ...

  return callback(null, { result: 'success', message: 'Succeed', code: 200})
}

export const myHandler = middy(dfuHandler)
  .use(accessTokenValidationMiddleware({
    // the ACLs (called scopes) here
    accessTokenScopes: ['dfu_allow_write'],
  }));
```

## Contribute

Clone and install the repo

`npm install`

test

`npm test`

Publish

`npx tsc -p ./` tag and push to the remote
