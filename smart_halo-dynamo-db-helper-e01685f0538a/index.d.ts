import { DynamoDB } from "aws-sdk";
import { LoggerInterface } from "@smarthalo/logger";

export interface Config {
  local: {
    host: string;
  };
}

export interface DDBHelper {
  readonly appendItemAttribute: <T>(
    attributeName: string,
    value: T | undefined,
    object?: { Item: { [key: string]: DynamoDB.AttributeValue } },
    type?: 'S' | 'N' | 'B' | 'SS' | 'NS' | 'BS' | 'M' | 'L' | 'NULL' | 'BOOL'
  ) => { Item: { [key: string]: DynamoDB.AttributeValue } };

  readonly deleteItemAsAPromise: (params: DynamoDB.DeleteItemInput) => Promise<DynamoDB.DeleteItemOutput>
  readonly putItemAsAPromise: (params: DynamoDB.PutItemInput) => Promise<DynamoDB.Types.PutItemOutput>
  readonly queryAsAPromise: (params: DynamoDB.Types.QueryInput) => Promise<DynamoDB.Types.QueryOutput>
  readonly getItemAsPromise: (params: DynamoDB.Types.GetItemInput) => Promise<DynamoDB.Types.GetItemOutput>
  readonly updateItemAsAPromise: (params: DynamoDB.Types.UpdateItemInput) => Promise<DynamoDB.Types.UpdateItemOutput>
  readonly batchWriteItemAsAPromise: (params: DynamoDB.Types.BatchWriteItemInput) => Promise<DynamoDB.Types.BatchWriteItemOutput>
  ddb: DynamoDB;
}

export const buildWithDefaultParameters: () => DDB;

export default class DDB implements DDBHelper {
  public constructor(logger: LoggerInterface, envConfig?: Config);
  readonly appendItemAttribute: <T>(
    attributeName: string,
    value: T | undefined,
    object?: { Item: { [key: string]: DynamoDB.AttributeValue } },
    type?: 'S' | 'N' | 'B' | 'SS' | 'NS' | 'BS' | 'M' | 'L' | 'NULL' | 'BOOL'
  ) => { Item: { [key: string]: DynamoDB.AttributeValue } };

  readonly deleteItemAsAPromise: (params: DynamoDB.DeleteItemInput) => Promise<DynamoDB.DeleteItemOutput>
  readonly putItemAsAPromise: (params: DynamoDB.PutItemInput) => Promise<DynamoDB.Types.PutItemOutput>
  readonly queryAsAPromise: (params: DynamoDB.Types.QueryInput) => Promise<DynamoDB.Types.QueryOutput>
  readonly getItemAsPromise: (params: DynamoDB.Types.GetItemInput) => Promise<DynamoDB.Types.GetItemOutput>
  readonly updateItemAsAPromise: (params: DynamoDB.Types.UpdateItemInput) => Promise<DynamoDB.Types.UpdateItemOutput>
  readonly batchWriteItemAsAPromise: (params: DynamoDB.Types.BatchWriteItemInput) => Promise<DynamoDB.Types.BatchWriteItemOutput>
  ddb: DynamoDB;
}



