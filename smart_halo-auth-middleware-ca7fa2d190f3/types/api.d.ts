import { APIGatewayEvent, Context, ProxyCallback, ProxyResult } from 'aws-lambda';

// Type aliases to hide the 'aws-lambda' package and have consistent, short naming.
export type ApiCallback = ProxyCallback;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiHandler = (event: APIGatewayEvent, context: Context, callback: ApiCallback) => void; // Same as ProxyHandler, but requires callback.
export type ApiResponse = ProxyResult;

export interface ErrorResponseBody {
  message: string;
  // Http status
  status: number;
}

export interface Payload<T> {
  data: T;
  user: { id: string };
}
