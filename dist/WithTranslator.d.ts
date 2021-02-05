import { Request } from 'express';
import { FindManyOptions } from 'typeorm';
export declare const uniqueFilter: (v: string, i: number, a: any) => boolean;
export declare class WithTranslator {
    static translate(req: Request, options: FindManyOptions): void;
}
