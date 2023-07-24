# Logger

A logger abstration used in @smarthalo by the microservices.

## How to install

`npm install ssh://bitbucket.org/smart_halo/logger.git#1.0.0`


## How to use it

```js
import Logger from '@smarthalo/logger'

const logger = new Logger();

logger.info("info")
logger.error("error")
logger.warn("warn")
logger.debug("debug")
```
