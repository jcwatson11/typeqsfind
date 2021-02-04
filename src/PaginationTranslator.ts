import {Request} from 'express';
import {FindManyOptions} from 'typeorm';

export class PaginationTranslator {
  public static translate(req: Request, options: FindManyOptions): void {
    // Process offset and limit
    options.skip =
      req.query.offset !== undefined ?
      parseInt(req.query.offset.toString())
      : req.query.start !== undefined ?
      parseInt(req.query.start.toString())
      : 0;
    options.take =
      req.query.limit !== undefined ?
      parseInt(req.query.limit.toString())
      : 10;

  }
}

