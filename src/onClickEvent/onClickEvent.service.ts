import { DynamoClient } from '../common/aws/dynamoClient';
import { onCLickEvent } from './types';
import { OnClickEventDataService } from './onClickEventData.service';

class OnClickEvent {
	private onClickEventDataService: OnClickEventDataService;
	constructor() {
		const dynamoClient = new DynamoClient();
		this.onClickEventDataService = new OnClickEventDataService(dynamoClient);
	}

	public async processOnCLickEvent(event: onCLickEvent): Promise<void> {
		// Do any other processing here...
		await this.onClickEventDataService.storeOnClickEvent(event);
	}

	public async getUserOnCLickEvents(userId: string): Promise<onCLickEvent[]> {
		// Do any other processing here...
		return await this.onClickEventDataService.getUserOnClickEvents(userId);
	}
}

export const OnClickEventService = new OnClickEvent();
