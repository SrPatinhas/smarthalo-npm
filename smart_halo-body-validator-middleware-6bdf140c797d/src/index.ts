import middy from '@middy/core';
import validator from '@middy/validator';

/////////
// Local
/////////
const deepCloneHandler = (object: middy.HandlerLambda): middy.HandlerLambda => JSON.parse(JSON.stringify(object));

//////////
// Public
//////////

// Types
export interface ValidatorOptions {
  inputSchema?: unknown;
  outputSchema?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BodyValidator = (options: ValidatorOptions) => middy.MiddlewareObject<any, any>;


// API
export const bodyValidator: BodyValidator = (options: ValidatorOptions) => ({
  after: validator(options).after,
  // A little hack to parse the event body as an object, for better validation
  before: (handler: middy.HandlerLambda, next: middy.NextFunction) => {
    const validatorMiddleware = validator(options);
    if (validatorMiddleware && validatorMiddleware.before) {
      if (handler && handler.event && handler.event.body) {
        const newHandler = deepCloneHandler(handler);
        newHandler.event.body = JSON.parse(newHandler.event.body);
        return validatorMiddleware.before(newHandler, next);
      }

      return validatorMiddleware.before(handler, next);
    }

    return next();
  },
});
