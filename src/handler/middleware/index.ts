import middy from 'middy';
import { jsonBodyParser, doNotWaitForEmptyEventLoop, httpEventNormalizer } from 'middy/middlewares';
import { generalConfig } from '../../config';
import { keyAuth, tokenAuth } from './auth';
import logger from '../../common/log.service';

const headers = { 'Access-Control-Allow-Origin': '*' };

export interface MiddlewareParams {
	showSuccess: boolean;
}

const defaultParams: MiddlewareParams = {
	showSuccess: true,
};

export const applyMiddleware = (func: any, params: MiddlewareParams = defaultParams) =>
	middy(func)
		.use({
			before: (handler, next) => {
				logger.config = {
					lambdaRequestId: handler.context.awsRequestId,
					serviceName: 'pets-deli-assessment',
				};
				return next();
			},
			after: async (handler, next) => {
				const body: any = handler.response || {};
				if (params.showSuccess) {
					body.success = true;
				}
				handler.response = {
					statusCode: 200,
					headers,
					body: JSON.stringify(body),
				};
				if (!generalConfig.stages.dev) {
					next();
				}
			},
			onError: async (handler, next) => {
				const error = handler.error as any;
				const statusCode = error.statusCode || 400;
				const message = error.message || 'Invalid request';
				logger.errorLog('Could not handle request', { error, message, trace: error.trace || '' });
				handler.response = {
					statusCode,
					success: false,
					headers,
					body: JSON.stringify({ message, success: false }),
				};
				if (!generalConfig.stages.dev) {
					next();
				}
			},
		})
		.use(jsonBodyParser())
		.use(httpEventNormalizer())
		.use(doNotWaitForEmptyEventLoop());

export const applyKeyAuthMiddleware = (key: string, func: any, other?: MiddlewareParams) =>
	applyMiddleware(func, other).use(keyAuth({ key }));
export const applyTokenAuthMiddleware = (func: any) => applyMiddleware(func).use(tokenAuth());

export default applyMiddleware;
