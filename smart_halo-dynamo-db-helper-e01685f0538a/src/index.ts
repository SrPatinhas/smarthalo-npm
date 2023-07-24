import Logger, { LoggerInterface } from '@smarthalo/logger';
import { DynamoDB } from 'aws-sdk';
import { Config, DDBHelper } from '../index';

export const buildWithDefaultParameters: () => DDBHelper = (): DDBHelper => new DDB(new Logger());

export default class DDB implements DDBHelper {

  public readonly ddb: DynamoDB;

  public constructor(private readonly logger: LoggerInterface, envConfig?: Config) {
    const config: DynamoDB.Types.ClientConfiguration = {
      apiVersion: '2012-08-10',
    };

    if (process.env.ENV && process.env.ENV === 'local') {
      config.endpoint = (envConfig && envConfig.local.host)
        ? envConfig.local.host
        : 'http://localhost:8000';
      config.region = 'localhost';
    }

    this.ddb = new DynamoDB(config);
  }

  public readonly appendItemAttribute = <T>(
    attributeName: string,
    value: T | undefined,
    object: { Item: { [key: string]: DynamoDB.AttributeValue } } = { Item: {} },
    type: 'S' | 'N' | 'B' | 'SS' | 'NS' | 'BS' | 'M' | 'L' | 'NULL' | 'BOOL' = 'S'
  ): { Item: { [key: string]: DynamoDB.AttributeValue } } => {
    if (value !== undefined) {
      object.Item[attributeName] = {};
      object.Item[attributeName][type] = value as unknown as undefined;
    }

    return object;
  }

  public readonly batchWriteItemAsAPromise = (params: DynamoDB.Types.BatchWriteItemInput): Promise<DynamoDB.Types.BatchWriteItemOutput> =>
    // tslint:disable-next-line:typedef
    new Promise((resolve, reject) => {
      this.ddb.batchWriteItem(params, (err: Error | string, data: DynamoDB.Types.BatchWriteItemOutput) => {
        if (err) {
          this.logger.error(err);
          return reject(err);
        }

        resolve(data);
      });
    })

  public readonly deleteItemAsAPromise = (params: DynamoDB.DeleteItemInput): Promise<DynamoDB.DeleteItemOutput> =>
  // tslint:disable-next-line:typedef
  new Promise((resolve, reject) => {
    this.ddb.deleteItem(params, (err: Error | string, data: DynamoDB.Types.DeleteItemOutput) => {
      if (err) {
        this.logger.error(err);
        return reject(err);
      }

      this.logger.info('Delete Item in DDB');
      this.logger.info(data);
      resolve(data);
    });
  })

  public readonly getItemAsPromise = (params: DynamoDB.Types.GetItemInput): Promise<DynamoDB.Types.GetItemOutput> =>
    // tslint:disable-next-line:typedef
    new Promise((resolve, reject) => {
      this.ddb.getItem(params, (err: Error | string, data: DynamoDB.Types.GetItemOutput) => {
        if (err) {
          this.logger.error(err);
          return reject(err);
        }

        resolve(data);
      });
    })

  public readonly putItemAsAPromise = (params: DynamoDB.PutItemInput): Promise<DynamoDB.Types.PutItemOutput> =>
    // tslint:disable-next-line:typedef
    new Promise((resolve, reject) => {
      // tslint:disable-next-line:typedef
      const callback = (err: Error | string, data: DynamoDB.Types.PutItemOutput) => {
        if (err) {
          this.logger.error(err);
          return reject(err);
        }

        this.logger.info('Put Item in DDB');
        this.logger.info(JSON.stringify(data));
        resolve(data);
      };
      this.ddb.putItem(params, callback);
  })

  public readonly queryAsAPromise = (params: DynamoDB.Types.QueryInput): Promise<DynamoDB.Types.QueryOutput> =>
    // tslint:disable-next-line:typedef
    new Promise((resolve, reject) => {
      this.ddb.query(params, (err: Error | string, data: DynamoDB.Types.QueryOutput) => {
        if (err) {
          this.logger.error(err);
          return reject(err);
        }

        resolve(data);
      });
    })

  public readonly updateItemAsAPromise = (params: DynamoDB.Types.UpdateItemInput): Promise<DynamoDB.Types.UpdateItemOutput> =>
    // tslint:disable-next-line:typedef
    new Promise((resolve, reject) => {
      this.ddb.updateItem(params, (err: Error | string, data: DynamoDB.Types.UpdateItemOutput) => {
        if (err) {
          this.logger.error(err);
          return reject(err);
        }

        resolve(data);
      });
    })
}
