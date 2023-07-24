"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyValidator = void 0;
const validator_1 = __importDefault(require("@middy/validator"));
/////////
// Local
/////////
const deepCloneHandler = (object) => JSON.parse(JSON.stringify(object));
// API
const bodyValidator = (options) => ({
    after: validator_1.default(options).after,
    // A little hack to parse the event body as an object, for better validation
    before: (handler, next) => {
        const validatorMiddleware = validator_1.default(options);
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
exports.bodyValidator = bodyValidator;
