import logger from '../common/log.service';
import applyMiddleware from './middleware';
import { OnClickEventService } from '../onClickEvent/onClickEvent.service';

/**
 * * Submits an onClick Event
 * @param eventType type of click event(buttonClick or navigationClick)
 * @param eventSource id of the button’ or ‚id of the navigation-entry
 * @param userId user ID
 */

export const CreateOnClickEvent = applyMiddleware(async (event: { body: string }, context: any) => {
	const eventBody = JSON.parse(JSON.stringify(event.body));
	logger.infoLog('Started processing CreateOnClickEvent', eventBody);

	try {
		await OnClickEventService.processOnCLickEvent(eventBody);
	} catch (error) {
		logger.errorLog('Unable to process CreateOnClickEvent', { error });
	}
});

/**
 * * Retrieves all User click activity
 * @queryparam userId
 */

export const GetUserClickEvents = applyMiddleware(async (event: any, context: any) => {
	logger.infoLog('Started processing GetUserClickEvents', event);

	try {
		const {
			queryStringParameters: { userId },
		} = event;
		if (!userId) {
			logger.infoLog('No userId passed in event', { event });
			return [];
		}
		const userOnClickEvents = await OnClickEventService.getUserOnCLickEvents(userId);
		return userOnClickEvents;
	} catch (error) {
		logger.errorLog('Unable to process CreateOnClickEvent', { error });
		throw new Error('Unable to get user clieck events');
	}
});
