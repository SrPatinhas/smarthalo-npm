import { bodyValidator } from './index';
import middy from '@middy/core';
import { Context } from 'aws-lambda';

type TestEvent = {
  body: string;
}

describe('body validator', () => {
  it('should not throw an error given a valid body', (done) => {
    const expected = JSON.stringify({
      test: 'somethingelse'
    });

    const handler = middy((event, context, cb) => {
      expect(typeof event.body).toEqual('string');
      expect(event.body).toEqual(expected);
      cb(null, {});
      done();
    });

    handler.use(bodyValidator({
      inputSchema: {
        required: ['body'],
        properties: {
          // this will pass validation
          body: {
            properties: {
              test: {
                type: 'string'
              },
            },
            type: 'object',
            required: ['test']
          }
        }
      }
    }));

    const event: TestEvent = {
      body: expected
    };

    const context: Context = {} as unknown as Context;

    handler(event, context, (err) => {
      if (err) {
        throw new Error('Test failed');
      }
    });
  });

  it('should throw an error given a invalid body', (done) => {
    const expected = JSON.stringify({
      wrong: 'somethingelse'
    });

    const handler = middy((event, context, cb) => {
      cb(null, {});
    });

    handler.use(bodyValidator({
      inputSchema: {
        required: ['body'],
        properties: {
          // this will pass validation
          body: {
            properties: {
              test: {
                type: 'string'
              },
            },
            type: 'object',
            required: ['test']
          }
        }
      }
    }));

    const event: TestEvent = {
      body: expected
    };

    const context: Context = {} as unknown as Context;

    handler(event, context, (err) => {
      if (err && typeof err === 'object' && err.message) {
        expect(err).not.toBeNull();
        expect(err.message).toEqual('Event object failed validation');
        return done();
      }

      throw new Error('Test failed');
    });
  });
});
