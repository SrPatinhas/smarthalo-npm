import { LoggerInterface, LogLevel, LogMessage } from '../index';

export default class Logger implements LoggerInterface {
  public debug(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void {
    this.emitLogMessage('debug', primaryMessage, supportingData);
  }
  public error(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void {
    this.emitLogMessage('error', primaryMessage, supportingData);
  }

  public info(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void {
    this.emitLogMessage('info', primaryMessage, supportingData);
  }

  public warn(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void {
    this.emitLogMessage('warn', primaryMessage, supportingData);
  }

  private readonly emitLogMessage = (level: LogLevel, primaryMessage: LogMessage, supportingData: LogMessage[]): void => {
    if (supportingData.length > 0) {
      console[level](primaryMessage, supportingData);
      return;
    }

    console[level](primaryMessage);
  }
}
