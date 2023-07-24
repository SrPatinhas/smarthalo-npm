
import { DDBHelper } from '..';
import { buildWithDefaultParameters } from './index';

describe('dynamodb', () => {
  describe('appendItemAttribute', () => {
    it('should return a item given a valid item as input', () => {
      const ddbHelper: DDBHelper = buildWithDefaultParameters();
      // tslint:disable-next-line:typedef
      const item = ddbHelper.appendItemAttribute<string>('foo', 'baz');
      // tslint:disable-next-line:no-magic-numbers
      ddbHelper.appendItemAttribute<number>('bar', 1234, item, 'N');
      expect(item).toEqual({
        Item: {
          bar: {
            N: 1234,
          },
          foo: {
            S: 'baz',
          },
        }
      });
    });
  });
});
