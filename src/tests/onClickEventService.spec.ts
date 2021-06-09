import { OnClickEventService } from '../onClickEvent/onClickEvent.service';
import { OnClickEventDataService } from '../onClickEvent/onClickEventData.service';
import { DynamoClient } from '../common/aws';
import { onCLickEventType } from '../onClickEvent/types';

// N/B: Proof of concept!

describe('OnClickEventService', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	beforeAll(async () => {});

	describe('processOnCLickEvent', () => {
		const onClickEventDataService = new OnClickEventDataService(new DynamoClient());
		const event = {
			userId: '123',
			eventType: onCLickEventType.ButtonClick,
			eventSource: 'nav4',
		};

		it('should process and save user click event', async () => {
			jest
				.spyOn(onClickEventDataService, 'storeOnClickEvent')
				.mockImplementation(() => new Promise((resolve) => resolve()));

			await OnClickEventService.processOnCLickEvent(event);

			expect(onClickEventDataService.storeOnClickEvent).toHaveBeenCalled();
		});
	});

	describe('getUserOnCLickEvents', () => {
		const onClickEventDataService = new OnClickEventDataService(new DynamoClient());
		const event = {
			userId: '123',
			eventType: onCLickEventType.ButtonClick,
			eventSource: 'nav4',
		};

		it('should return all user click events', async () => {
			jest
				.spyOn(onClickEventDataService, 'getUserOnClickEvents')
				.mockImplementation(() => new Promise((resolve) => resolve([event])));

			await OnClickEventService.getUserOnCLickEvents(event.userId);

			expect(onClickEventDataService.getUserOnClickEvents).toHaveBeenCalled();
		});
	});
});
