"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenValidationMiddleware = void 0;
const axios_1 = __importDefault(require("axios"));
const http_errors_1 = __importDefault(require("http-errors"));
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
exports.accessTokenValidationMiddleware = (options) => ({
    // tslint:disable-next-line:typedef
    before: (handler) => __awaiter(void 0, void 0, void 0, function* () {
        const { env, logger, accessTokenScopes, url } = options;
        const event = handler.event;
        const throwUnauthorizedError = () => {
            throw (http_errors_1.default(401, 'Unauthorized'));
        };
        let response;
        if (!urlConfig[env] && !url) {
            logger.error('access-token-validation.middleware => the auth service url is not set!');
            throw (http_errors_1.default(500, 'An error occurs on the authorization process, the auth url is not valid.'));
        }
        const serviceUrl = url || urlConfig[env];
        try {
            response = yield axios_1.default.get(serviceUrl, {
                headers: {
                    'x-consumer-token': event.headers['x-consumer-token'],
                    'x-access-token': event.headers['x-access-token'],
                },
                params: {
                    scopes: accessTokenScopes.join(',')
                },
            });
        }
        catch (err) {
            logger.error(err);
            const message = err
                && err.response
                && err.response.data
                && err.response.data.error
                && err.response.data.error.message
                ? err.response.data.error.message
                : 'Forbidden';
            const status = err
                && err.response
                && err.response.status
                ? err.response.status
                : 403;
            throw (http_errors_1.default(status, message));
        }
        if (!response || (response && response.status !== 200)) {
            logger.error(`Auth service responded unsuccessfully response ${response.status}`);
            throwUnauthorizedError();
        }
    })
});
