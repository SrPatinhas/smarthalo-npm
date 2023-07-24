"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor() {
        this.emitLogMessage = (level, primaryMessage, supportingData) => {
            if (supportingData.length > 0) {
                console[level](primaryMessage, supportingData);
                return;
            }
            console[level](primaryMessage);
        };
    }
    debug(primaryMessage, ...supportingData) {
        this.emitLogMessage('debug', primaryMessage, supportingData);
    }
    error(primaryMessage, ...supportingData) {
        this.emitLogMessage('error', primaryMessage, supportingData);
    }
    info(primaryMessage, ...supportingData) {
        this.emitLogMessage('info', primaryMessage, supportingData);
    }
    warn(primaryMessage, ...supportingData) {
        this.emitLogMessage('warn', primaryMessage, supportingData);
    }
}
exports.default = Logger;
