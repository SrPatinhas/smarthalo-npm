import middy from '@middy/core';
import { AccessTokenValidationScopesType }  from './types/auth-scopes';
import { LoggerInterface } from '@smarthalo/logger';

interface AccessTokenValidationMiddleware {
  <T=unknown, R=unknown>(options: Options): middy.MiddlewareObject<T, R>
}

export interface Options {
  accessTokenScopes: AccessTokenValidationScopes[];
  logger: LoggerInterface;
  // URL of the auth service, it will use the defaut setup if not provided.
  url?: string;
  env: 'local' | 'development' | 'staging' | 'production';
}
export type AccessTokenValidationScopes = AccessTokenValidationScopesType;

export const accessTokenValidationMiddleware: AccessTokenValidationMiddleware;
