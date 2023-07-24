# Smarthalo Body validator

This middleware uses the [validator middleware](https://github.com/middyjs/middy/tree/master/packages/validator#sample-usage), but in top of it, it formats the event body from string to a JSON object.

So the schema used to validate the input of an JSON API endpoint, can contains rules to validate the body.

## How to install

1.0.0: `npm install ssh://git@bitbucket.org/smart_halo/body-validator-middleware.git#1.0.0`

## Basic usage

```js
const middy = require('@middy/core');
const validator = require('@smarthalo/body-validator-middleware');
import middy from '@middy/core';
import { bodyValidator } from '@smarthalo/body-validator-middleware';

const handler = middy((event, context, cb) => {
  cb(null, {})
})

const schema = {
  required: ['body', 'foo'],
  properties: {
    // this will pass validation
    body: {
      properties: {
        id: {
          type: 'string'
        },
        name: {
          type: 'string'
        }
      },
      type: 'object'
    },
    // this won't as it won't be in the event
    foo: {
      type: 'string'
    }
  }
}

handler.use(validator({
  inputSchema: schema
}))

// invokes the handler, note that property foo is missing
const event = {
  body: {
    id: '1q2w3e4r5t6y7u',
    name: 'foo'
  }
}
handler(event, {}, (err, res) => {
  expect(err.message).toEqual('Event object failed validation')
})
```

## Contribute

Clone and install the repo

`npm install`

test

`npm test`

Publish

`npm publish` tag and push to the remote
