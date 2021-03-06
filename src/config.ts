import dotenv from 'dotenv';
dotenv.config();

export enum EnumEnvironment {
  Prod = 'prod',
  Dev = 'dev',
}

export const generalConfig = {
  aws: {
    dynamoEndpoint: process.env.IS_OFFLINE ? 'http://localhost:8000' : undefined,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || undefined,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || undefined,
    dynamoRegion: process.env.IS_OFFLINE ? 'localhost' : process.env.AWS_REGION,
    dataTableName: process.env.DATA_TABLE_NAME,
  },
  prod: process.env.ENV === EnumEnvironment.Prod,
  env: process.env.ENV,
  stages: {
    dev: process.env.ENV === EnumEnvironment.Dev || process.env.IS_OFFLINE,
    prod: process.env.ENV === EnumEnvironment.Prod,
  },
  isOffline: process.env.IS_OFFLINE || false,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET || '_',
};
