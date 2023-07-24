"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@smarthalo/logger");
const aws_sdk_1 = require("aws-sdk");
exports.buildWithDefaultParameters = () => new DDB(new logger_1.default());
class DDB {
    constructor(logger, envConfig) {
        this.logger = logger;
        this.appendItemAttribute = (attributeName, value, object = { Item: {} }, type = 'S') => {
            if (value !== undefined) {
                object.Item[attributeName] = {};
                object.Item[attributeName][type] = value;
            }
            return object;
        };
        this.batchWriteItemAsAPromise = (params) => 
        // tslint:disable-next-line:typedef
        new Promise((resolve, reject) => {
            this.ddb.batchWriteItem(params, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return reject(err);
                }
                resolve(data);
            });
        });
        this.deleteItemAsAPromise = (params) => 
        // tslint:disable-next-line:typedef
        new Promise((resolve, reject) => {
            this.ddb.deleteItem(params, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return reject(err);
                }
                this.logger.info('Delete Item in DDB');
                this.logger.info(data);
                resolve(data);
            });
        });
        this.getItemAsPromise = (params) => 
        // tslint:disable-next-line:typedef
        new Promise((resolve, reject) => {
            this.ddb.getItem(params, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return reject(err);
                }
                resolve(data);
            });
        });
        this.putItemAsAPromise = (params) => 
        // tslint:disable-next-line:typedef
        new Promise((resolve, reject) => {
            // tslint:disable-next-line:typedef
            const callback = (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return reject(err);
                }
                this.logger.info('Put Item in DDB');
                this.logger.info(JSON.stringify(data));
                resolve(data);
            };
            this.ddb.putItem(params, callback);
        });
        this.queryAsAPromise = (params) => 
        // tslint:disable-next-line:typedef
        new Promise((resolve, reject) => {
            this.ddb.query(params, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return reject(err);
                }
                resolve(data);
            });
        });
        this.updateItemAsAPromise = (params) => 
        // tslint:disable-next-line:typedef
        new Promise((resolve, reject) => {
            this.ddb.updateItem(params, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return reject(err);
                }
                resolve(data);
            });
        });
        const config = {
            apiVersion: '2012-08-10',
        };
        if (process.env.ENV && process.env.ENV === 'local') {
            config.endpoint = (envConfig && envConfig.local.host)
                ? envConfig.local.host
                : 'http://localhost:8000';
            config.region = 'localhost';
        }
        this.ddb = new aws_sdk_1.DynamoDB(config);
    }
}
exports.default = DDB;
