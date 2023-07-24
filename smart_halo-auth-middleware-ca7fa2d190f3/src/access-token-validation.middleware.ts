import middy from '@middy/core';
import axios, { AxiosResponse } from 'axios';
import createHttpError from 'http-errors';

import { AccessTokenValidationMiddleware, Options } from '../index';
import { ApiEvent } from '../types/api';

//////////
// Local
//////////

// Config
const urlConfig = {
  development: 'https://devapi.smarthalo.bike/v2/access_token_validation',
  local: 'http://localhost:3000/v2/access_token_validation',
  production: 'https://api.smarthalo.bike/v2/access_token_validation',
  staging: 'https://stageapi.smarthalo.bike/v2/access_token_validation',
};

// Access token authorization middleware
export const accessTokenValidationMiddleware: AccessTokenValidationMiddleware = <T = unknown, R = unknown>(options: Options): middy.MiddlewareObject<T, R> =>
  ({
    // tslint:disable-next-line:typedef
    before: async (handler: middy.HandlerLambda) => {
      const { env, logger, accessTokenScopes, url } = options;
      const event: ApiEvent = handler.event;
      const throwUnauthorizedError: () => void = (): void => {
        throw (createHttpError(401, 'Unauthorized'));
      };

      let response: AxiosResponse;
      if (!urlConfig[env] && !url) {
        logger.error('access-token-validation.middleware => the auth service url is not set!');
        throw (createHttpError(500, 'An error occurs on the authorization process, the auth url is not valid.'));
      }

      const serviceUrl: string = url || urlConfig[env];
      try {
        response = await axios.get(serviceUrl, {
          headers: {
            'x-consumer-token': event.headers['x-consumer-token'],
            'x-access-token': event.headers['x-access-token'],
          },
          params: {
            scopes: accessTokenScopes.join(',')
          },
        });

      } catch (err) {
        logger.error(err);
        const message: string = err
          && err.response
          && err.response.data
          && err.response.data.error
          && err.response.data.error.message
          ? err.response.data.error.message
          : 'Forbidden';
        const status: number = err
          && err.response
          && err.response.status
          ? err.response.status
          : 403;

        throw (createHttpError(status, message));
      }

      if (!response || (response && response.status !== 200)) {
        logger.error(`Auth service responded unsuccessfully response ${response.status}`);
        throwUnauthorizedError();
      }
    }
  });
