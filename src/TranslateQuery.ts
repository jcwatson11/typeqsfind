import {Request} from 'express';
import {FindManyOptions} from 'typeorm';
import {WithTranslator} from './WithTranslator';
import {WhereTranslator} from './WhereTranslator';
import {PaginationTranslator} from './PaginationTranslator';
import {OrderByTranslator} from './OrderByTranslator';
import {OptionsTranslator} from './OptionsTranslator';

export function TranslateQuery(req: Request): FindManyOptions  {
  var options: FindManyOptions = {} as FindManyOptions;

  // Apply the options object from the querystring
  // or the body first. Then other querystring parameters
  // can be applied to modify it or add to it.
  if(OptionsTranslator.hasOptions(req)) {
    options = OptionsTranslator.translate(req);
  }

  // Process pagination
  PaginationTranslator.translate(req, options);

  // Add relations
  WithTranslator.translate(req, options);

  // Order the results
  OrderByTranslator.translate(req, options);

  // Process where clauses
  WhereTranslator.translate(req, options);

  // Return options
  return options as FindManyOptions;
};
