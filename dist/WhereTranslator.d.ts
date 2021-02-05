import { Request } from 'express';
import { FindManyOptions, FindOperator } from 'typeorm';
export declare class WhereTranslator {
    static wheres: {
        [key: string]: any;
    } | {
        [key: string]: any;
    }[];
    static setNestedFieldValues(fieldName: string, value: string | string[] | FindOperator<any> | {
        [key: string]: any;
    }[]): void;
    static OrWhere(fieldName: string, values: string[]): any;
    static translate(req: Request, options: FindManyOptions): void;
}
