import { Request } from 'express';
import { FindManyOptions } from 'typeorm';
export declare class OptionsTranslator {
    static decode(jsonString: string): string;
    static hasOptions(req: Request): boolean;
    static translate(req: Request): FindManyOptions;
}
