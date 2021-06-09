import { DynamoClient } from '../common/aws';
import { generalConfig } from '../config';
import { onCLickEvent } from './types';
import logger from '../common/log.service';

const tableName = generalConfig.aws.dataDynamoTableName;
const dataKey = 'onClickEvent';
const detailsKeyPrefix = 'on_click_event';

export class OnClickEventDataService {
	constructor(private readonly dynamoClient: DynamoClient) {}

	public async storeOnClickEvent(event: onCLickEvent): Promise<void> {
		const timeStamp = new Date().getTime();
		const item: any = {
			...event,
			dataKey,
      sKey: `${detailsKeyPrefix}_${event.userId}_${timeStamp}`,
      timeStamp,
		};

		await this.dynamoClient.putItem(tableName, item);
		logger.infoLog('Stored oClickEvent data successfully', { event });
	}

	public async getUserOnClickEvents(userId: string): Promise<onCLickEvent[]> {
		const { Items } = await this.dynamoClient
			.query({
				TableName: tableName,
				KeyConditionExpression: 'dataKey = :dataKey and begins_with(sKey, :sKey)',
				ExpressionAttributeValues: {
					':dataKey': dataKey,
					':sKey': `${detailsKeyPrefix}_${userId}`,
				},
			})
			.promise();

		if (!Items.length) {
			return [];
		}
		Items.forEach((item) => {
			delete item.dataKey;
			delete item.sKey;
			delete item.updatedAt;
		});
		return Items as onCLickEvent[];
	}
}
