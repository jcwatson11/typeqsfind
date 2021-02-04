import { Request } from 'express';
import { FindManyOptions } from 'typeorm';
export declare class typeqs {
    static TranslateQuery(req: Request): FindManyOptions;
}
