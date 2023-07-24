# Dynamo DB Helper

A Dynamo DB abstration used in @smarthalo by the microservices.

## How to install

`npm install ssh://bitbucket.org/smart_halo/dynamo-db-helper.git#1.0.0`


## How to use it

```js
import DDB, { build } from '@smarthalo/dynamo-db-helper'
import Logger from '@smarthalo/logger'

const ddb = build();

// or

const ddbHelper = new DDB(new Logger())

```

## *!WARNING!* 

Promise support in this lib is deprecated, please use the aws-sdk [promises](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/using-promises.html) instead.

Use the promise request like this: 


```js
const ddbHelper = new DDB(new Logger());
const ddbInstance = ddbHelper.ddb;
await ddbInstance.query({ ... }).promise();
```


