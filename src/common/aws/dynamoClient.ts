import { DynamoDB } from 'aws-sdk';
import { generalConfig } from '../../config';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { chunkArray } from './utils';
interface Key {
  [key: string]: string;
}

interface FormattedUpdate {
  updateExpression: string;
  updateValues: {
    [key: string]: any;
  };
  attributeNames: {
    [key: string]: any;
  };
}

type DynamoOptions = DynamoDB.DocumentClient.DocumentClientOptions & ServiceConfigurationOptions & DynamoDB.ClientApiVersions;

export class DynamoClient extends DynamoDB.DocumentClient {
  constructor() {
    const { aws } = generalConfig;
    const config: DynamoOptions = {
      endpoint: aws.dynamoEndpoint,
      maxRetries: 3,
      httpOptions: {
        timeout: 5000,
      },
    };
    // if (aws.accessKeyId && aws.secretAccessKey) {
    //   config.credentials = {
    //     accessKeyId: aws.accessKeyId,
    //     secretAccessKey: aws.secretAccessKey,
    //   };
    // }

    super(config);
  }

  async getItem<T>(table: string, key: Key, removeKeys: boolean = true): Promise<T | undefined> {
    const response = await this.get({ TableName: table, Key: key }).promise();
    const item = response.Item;
    if (!item) {
      return undefined;
    }
    if (removeKeys) {
      Object.keys(key).forEach(k => delete item[k]);
    }
    return item as T;
  }

  async batchGetItems<T>(table: string, keys: Key[]): Promise<T[]> {
    let keysArray = keys.length > 100 ? chunkArray(keys) : [keys];
    let batchResponse = [];

    for (const chunk of keysArray) {
      const RequestItems = {
        [table]: {
          Keys: chunk,
        },
      };

      const response = await this.batchGet({ RequestItems }).promise();
      const items = response.Responses;

      if (items && items[table].length) {
        batchResponse = [...batchResponse, ...items[table]];
      }
    }

    return batchResponse as Partial<T[]>;
  }

  async putItem<T>(table: string, item: Partial<T>, other?: Partial<DocumentClient.PutItemInput>): Promise<DocumentClient.PutItemOutput> {
    const now = new Date();
    const updatedAt = Math.floor(now.getTime() / 1000);
    const response = await this.put({ TableName: table, Item: { ...item, updatedAt }, ...other }).promise();
    return response;
  }

  async updateItem<T>(table: string, key: Key, values: Partial<T>): Promise<void> {
    const now = new Date();
    const updatedAt = Math.floor(now.getTime() / 1000);
    const { updateExpression, updateValues, attributeNames } = this.formatUpdateExpression({ ...values, updatedAt });
    await this.update({
      TableName: table,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: updateValues,
      ReturnValues: 'NONE',
    }).promise();
  }

  async deleteItem<T>(table: string, pKey: string, sKey: string) {
    await this.delete({
      TableName: table,
      Key: { pKey, sKey },
    }).promise();
  }

  formatUpdateExpression(values: any): FormattedUpdate {
    let updateExpression = 'set ';
    const updateValues = {};
    const attributeNames = {};
    const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
    const updateEntries = Object.keys(values).length;
    if (updateEntries === 0 || updateEntries > alphabet.length) {
      return { updateExpression: '', updateValues: {}, attributeNames };
    }
    Object.keys(values).forEach((key, i) => {
      const index = alphabet[i];
      attributeNames[`#${index}`] = key;
      updateExpression += `#${index} = :${index},`;
      updateValues[`:${index}`] = values[key];
    });
    updateExpression = updateExpression.slice(0, -1);

    return { updateExpression, updateValues, attributeNames };
  }
}
