import middy from '@middy/core';
import Logger from '@smarthalo/logger';
import axios from 'axios';

import { accessTokenValidationMiddleware } from './access-token-validation.middleware';

////////////
// Mock common libs
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('accessTokenValidationMiddleware', () => {
  describe('Errors handling', () => {
    [
      {
        apiResponse: {
          response: {
            data: {
              error: {
                message: 'Unauthorized',
              },
            },
            status: 401,
          },
        },
        expected: {
          message: 'Unauthorized',
          status: 401,
        },
      },
      {
        apiResponse: {
          response: {
            data: {},
            status: 403
          },
        },
        expected: {
          message: 'Forbidden',
          status: 403,
        },
      },
      {
        apiResponse: {
          response: {
            data: {
              error: {
                message: 'Bad request',
              },
            },
            status: 400
          },
        },
        expected: {
          message: 'Bad request',
          status: 400,
        },
      },
      {
        apiResponse: {
          response: {
            data: {
              error: {
                message: 'Internal server error',
              },
            },
            status: 500
          },
        },
        expected: {
          message: 'Internal server error',
          status: 500,
        },
      },

    ].forEach((test: {apiResponse: unknown; expected: { message: unknown; status: number; } }) =>
      it(`Should throw an Unauthorized error given an invalid api response ${JSON.stringify(test.apiResponse)}`, async () => {
        const accessTokenScopes = ['activity_owner_full_access', 'foo'];
        const handlerMock = {
          event: {
            headers: {
              'x-access-token': 'foo',
              'x-consumer-token': 'bar',
            }
          }
        } as unknown as middy.HandlerLambda;
        mockedAxios.get.mockImplementationOnce((url, config) => {
          expect(url).toEqual('http://localhost:3000/v2/access_token_validation');
          expect(config).toEqual({
            headers: {
              'x-consumer-token': handlerMock.event.headers['x-consumer-token'],
              'x-access-token': handlerMock.event.headers['x-access-token'],
            },
            params: {
              scopes: accessTokenScopes.join(','),
            },
          });

          return Promise.reject(test.apiResponse);
        });

        const loggerMock = {
          error: (message: unknown) => {
            expect(message).toEqual(test.apiResponse);
          }
        } as unknown as Logger;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accessTokenValidationMiddlewareInstance: middy.MiddlewareObject<any, any> = accessTokenValidationMiddleware({
          accessTokenScopes,
          env: 'local',
          logger: loggerMock,
        });

        try {
          if (accessTokenValidationMiddlewareInstance.before) {
            await accessTokenValidationMiddlewareInstance.before(handlerMock, () => true as unknown as middy.NextFunction);
          }
          throw new Error('This test should throw an error');
        } catch (err) {
          expect(err.message).toEqual(test.expected.message);
          expect(err.status).toEqual(test.expected.status);
        }
      }));

    it('Should throw an Unauthorized error given an no 200 http response code', async () => {
      const accessTokenScopes = ['activity_owner_full_access', 'foo'];
      const apiResponse = {
        expected: {
          message: 'Unauthorized',
          status: 401,
        },
        response: {
          data: {
            error: {
              message: 'Internal server error',
            },
          },
          status: 500
        },
      };
      const handlerMock = {
        event: {
          headers: {
            'x-access-token': 'foo',
            'x-consumer-token': 'bar',
          }
        }
      } as unknown as middy.HandlerLambda;
      mockedAxios.get.mockImplementationOnce((url, config) => {
        expect(url).toEqual('https://devapi.smarthalo.bike/v2/access_token_validation');
        expect(config).toEqual({
          headers: {
            'x-consumer-token': handlerMock.event.headers['x-consumer-token'],
            'x-access-token': handlerMock.event.headers['x-access-token'],
          },
          params: {
            scopes: accessTokenScopes.join(','),
          },
        });

        return Promise.resolve(apiResponse.response);
      });

      const loggerMock = {
        error: (message: string) => {
          expect(message).toEqual(`Auth service responded unsuccessfully response ${apiResponse.response.status}`);
        }
      } as unknown as Logger;

      const accessTokenValidationMiddlewareInstance: middy.MiddlewareObject <unknown, unknown> = accessTokenValidationMiddleware({
        accessTokenScopes,
        env: 'development',
        logger: loggerMock,
      });

      try {
        if (accessTokenValidationMiddlewareInstance.before) {
          await accessTokenValidationMiddlewareInstance.before(handlerMock, () => true as unknown as middy.NextFunction);
        }
        throw new Error('This test should throw an error');
      } catch (err) {
        expect(err.message).toEqual(apiResponse.expected.message);
        expect(err.status).toEqual(apiResponse.expected.status);
      }
    });
  });

  describe('Success responses', () => {
    it('Should not throw any error given a 200 Http code response from the auth api', async () => {
      const accessTokenScopes = ['activity_owner_full_access', 'foo'];
      const apiResponse = {
        response: {
          data: {},
          status: 200
        },
      };
      const handlerMock = {
        event: {
          headers: {
            'x-access-token': 'foo',
            'x-consumer-token': 'bar',
          }
        }
      } as unknown as middy.HandlerLambda;
      mockedAxios.get.mockImplementationOnce((url, config) => {
        expect(url).toEqual('https://api.smarthalo.bike/v2/access_token_validation');
        expect(config).toEqual({
          headers: {
            'x-consumer-token': handlerMock.event.headers['x-consumer-token'],
            'x-access-token': handlerMock.event.headers['x-access-token'],
          },
          params: {
            scopes: accessTokenScopes.join(','),
          },
        });

        return Promise.resolve(apiResponse.response);
      });

      const loggerMock = {} as unknown as Logger;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accessTokenValidationMiddlewareInstance: middy.MiddlewareObject <any, any> = accessTokenValidationMiddleware({
        accessTokenScopes,
        env: 'production',
        logger: loggerMock,
      });

      if (!accessTokenValidationMiddlewareInstance.before) {
        throw new Error('before() should be implemented');
      }

      await accessTokenValidationMiddlewareInstance.before(
        handlerMock,
        () => true as unknown as middy.NextFunction
      );
    });

    it('Should not throw any error and use the custom URL given a 200 Http code response from the auth api, and a custom URL', async () => {
      const accessTokenScopes = ['activity_owner_full_access', 'foo'];
      const custonURL = 'https://myauthapi.com/auth';
      const apiResponse = {
        response: {
          data: {},
          status: 200
        },
      };
      const handlerMock = {
        event: {
          headers: {
            'x-access-token': 'foo',
            'x-consumer-token': 'bar',
          }
        }
      } as unknown as middy.HandlerLambda;
      mockedAxios.get.mockImplementationOnce((url, config) => {
        expect(url).toEqual(custonURL);
        expect(config).toEqual({
          headers: {
            'x-consumer-token': handlerMock.event.headers['x-consumer-token'],
            'x-access-token': handlerMock.event.headers['x-access-token'],
          },
          params: {
            scopes: accessTokenScopes.join(','),
          },
        });

        return Promise.resolve(apiResponse.response);
      });

      const loggerMock = {} as unknown as Logger;
      const accessTokenValidationMiddlewareInstance: middy.MiddlewareObject <unknown, unknown> = accessTokenValidationMiddleware({
        accessTokenScopes,
        env: 'production',
        logger: loggerMock,
        url: custonURL,
      });

      if (!accessTokenValidationMiddlewareInstance.before) {
        throw new Error('before() should be implemented');
      }

      await accessTokenValidationMiddlewareInstance.before(
        handlerMock,
        () => true as unknown as middy.NextFunction
      );
    });
  });
});
