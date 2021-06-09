import middy from 'middy';
import createHttpError from 'http-errors';
import JWTService from './JWTService';
import logger from '../../common/log.service';

interface KeyAuthConfig {
	key: string;
}

export const keyAuth: middy.Middleware<KeyAuthConfig> = (config: KeyAuthConfig) => {
	return {
		before: (handler, next) => {
			const { queryStringParameters = {} } = handler.event;
			if (!queryStringParameters || queryStringParameters.key !== config.key) {
				throw new createHttpError.Unauthorized();
			}
			next();
		},
	};
};

interface Body {
	token: string;
}

export const tokenAuth: middy.Middleware<any> = () => {
	return {
		before: (handler, next) => {
			const { event } = handler;
			const body: Body = event.body;
			console.log('Body', body);
			const jwt = new JWTService();
			try {
				const payload = jwt.verifyToken(body.token);
				handler.event.body.payload = payload;
				next();
			} catch (e) {
				logger.errorLog('Authentication error', { e });
				throw new createHttpError.Unauthorized();
			}
		},
	};
};
