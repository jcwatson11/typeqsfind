import {Request} from 'express';
import {FindManyOptions} from 'typeorm';

export class OrderByTranslator {
  // Set up some helper functions for orderby
  static catchOrderByFormatError(directionalOperator: string, originalValue: string): void {
    if(directionalOperator !== 'ASC' && directionalOperator !== 'DESC') {
      throw 'orderby='+originalValue+' does not have a proper directional operator.';
    }
  }

  static setSingleOrderBy(name: string, options: FindManyOptions): void {
    options.order = options.order ? options.order:{};
    let parts: string[] = name.split('|');
    if(parts.length > 1) {
      this.catchOrderByFormatError(parts[1], name);
      options.order[parts[0]] = (parts[1]==='ASC') ? 'ASC':'DESC';
    } else {
      options.order[name] = 'ASC';
    }
  };

  public static translate(req: Request, options: FindManyOptions): void {
    // Process orderby[]=Field|DESC syntax
    for(let name in req.query) {
      let orderbyMatcher = /^orderby$/;
      if(name.match(orderbyMatcher)) {
        if(Array.isArray(req.query[name])) {
          for(let i:number=0;i<req.query[name].length;i++) {
            let fieldname: string = req.query[name][i].toString();
            this.setSingleOrderBy(fieldname, options);
          }
        } else {
          let fieldname: string = req.query.orderby.toString();
          this.setSingleOrderBy(fieldname, options);
        }
      }

      // Process orderbyFieldname=DESC syntax
      let obMatcher = /^orderby.+/;
      if(name.match(obMatcher)) {
        let fieldname: string = name.replace(/^orderby/,'');
        let direction: string = (req.query[name]) ? req.query[name].toString():'ASC';
        this.setSingleOrderBy(fieldname + '|' + direction, options);
      }
    }
  }
}

