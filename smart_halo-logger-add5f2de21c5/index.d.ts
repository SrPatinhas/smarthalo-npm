export type LogMessage = string | Error | {};
export type LogLevel = 'debug' | 'warn' | 'info' | 'error';
export interface LoggerInterface {
  debug(primaryMessage: LogMessage , ...supportingData: LogMessage[]): void;
  error(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void;
  info(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void;
  warn(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void;
}

declare class Logger implements LoggerInterface {
  debug(primaryMessage: LogMessage , ...supportingData: LogMessage[]): void;
  error(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void;
  info(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void;
  warn(primaryMessage: LogMessage, ...supportingData: LogMessage[]): void;
}

export default Logger
