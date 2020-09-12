import dotEnv from 'dotenv';

export interface IConfig {
    TOKEN: string;
    PREFIX: string;
    TWICH_ID: string;
}

export const config: IConfig = (dotEnv.config().parsed as unknown) as IConfig;