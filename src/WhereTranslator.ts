import {Request} from 'express';
import {FindManyOptions, IsNull, Not, FindOperator, Between, Like, MoreThan, LessThan, MoreThanOrEqual, LessThanOrEqual, ILike, In} from 'typeorm';
import dot from 'dot-object';

export class WhereTranslator {
  // Set up some helper functions for orderBy
  //
  public static wheres: {[key: string]: any} | {[key: string]: any}[];
  
  public static setNestedFieldValues(fieldName: string, value: string | string[] | FindOperator<any> | {[key: string]: any}[]) {
    if(fieldName === '' && Array.isArray(value)) {
      this.wheres = value;
    }
    if(fieldName.indexOf('.') !== -1) {
      let obj: any = {};
      let firstName: string = fieldName.split('.')[0];
      obj[fieldName] = value;
      dot.object(obj);
      this.wheres[firstName] = obj[firstName];
    } else {
      this.wheres[fieldName] = value;
    }
  }

  // orwhereField helper
  public static OrWhere(fieldName: string, values: string[]): any {
    let parts: string[] = fieldName.split('.');
    let field: string = parts.pop();
    let ret: any[] = values.map((val: string) => {
      let ob: any = {};
      ob[field] = val;
      return ob;
    })
    return ret;
  };


  public static translate(req: Request, options: FindManyOptions): void {
    // Begin processing WHERE options
    this.wheres = {};

    // Loop through request looking for where-type operators
    for(let name in req.query) {
      // Process whereField
      if(name.indexOf('orwhere') === 0) {
        let fieldName: string = name.replace(/^orwhere/,'');
        let value: string[] = (<string[]>req.query[name]).map(value => value.toString());
        this.setNestedFieldValues('', this.OrWhere(fieldName, value));
      }

      // Process whereField
      if(name.indexOf('where') === 0) {
        let fieldName: string = name.replace(/^where/,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValues(fieldName, value);
      }

      // Process inarrayField
      if(name.indexOf('inarray') === 0) {
        let fieldName: string = name.replace(/^inarray/,'');
        let value: string[] = (<string[]>req.query[name]).map(value => value.toString());
        this.setNestedFieldValues(fieldName, In(value));
      }

      // Process notinarrayField
      if(name.indexOf('notinarray') === 0) {
        let fieldName: string = name.replace(/^notinarray/,'');
        let value: string[] = (<string[]>req.query[name]).map(value => value.toString());
        this.setNestedFieldValues(fieldName, Not(In(value)));
      }

      // Process isnullField
      if(name.indexOf('isnull') === 0) {
        let fieldName: string = name.replace(/^isnull/,'');
        this.setNestedFieldValues(fieldName, IsNull());
      }

      // Process isnullField
      if(name.indexOf('isnotnull') === 0) {
        let fieldName: string = name.replace(/^isnotnull/,'');
        this.setNestedFieldValues(fieldName, Not(IsNull()));
      }

      // Process betweenField
      if(name.indexOf('between') === 0) {
        let fieldName: string = name.replace(/^between/,'');
        let value: string[] = (<string[]>req.query[name]).map(value => value.toString());
        this.setNestedFieldValues(fieldName, Between(value[0], value[1]));
      }

      // Process likeField
      if(name.indexOf('like') === 0) {
        let fieldName: string = name.replace(/^like/,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValues(fieldName, Like(value));
      }

      // Process likeField
      if(name.indexOf('ilike') === 0) {
        let fieldName: string = name.replace(/^ilike/,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValues(fieldName, ILike(value));
      }

      // Process greaterthanField
      let gtMatcher = /^greaterthan(?!orequalto)/;
      if(name.match(gtMatcher)) {
        let fieldName: string = name.replace(gtMatcher,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValues(fieldName, MoreThan(value));
      }

      // Process greaterthanorequaltoField
      let gteMatcher = /^greaterthanorequalto/;
      if(name.match(gteMatcher)) {
        let fieldName: string = name.replace(gteMatcher,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValues(fieldName, MoreThanOrEqual(value));
      }

      // Process lessthanField
      let ltMatcher = /^lessthan(?!orequalto)/;
      if(name.match(ltMatcher)) {
        let fieldName: string = name.replace(ltMatcher,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValues(fieldName, LessThan(value));
      }

      // Process lessthanorequaltoField
      let lteMatcher = /^lessthanorequalto/;
      if(name.match(lteMatcher)) {
        let fieldName: string = name.replace(lteMatcher,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValues(fieldName, LessThanOrEqual(value));
      }

    }

    // Set the wheres
    if(Object.keys(this.wheres).length !== 0) {
      options.where = this.wheres;
    }
  }
}

