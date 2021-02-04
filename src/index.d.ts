/// <reference types="qs" />
import { Request } from 'express';
import { FindManyOptions } from 'typeorm';
export declare const TranslateQuery: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => FindManyOptions<any>;
