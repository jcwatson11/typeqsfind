import { Request } from 'express';
import { FindManyOptions } from 'typeorm';
export declare class PaginationTranslator {
    static translate(req: Request, options: FindManyOptions): void;
}
