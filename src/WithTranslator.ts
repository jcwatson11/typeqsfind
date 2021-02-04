import {Request} from 'express';
import {FindManyOptions} from 'typeorm';

export const uniqueFilter = (v: string, i: number, a: any): boolean => {
  return a.indexOf(v) === i;
};

export class WithTranslator {
  public static translate(req: Request, options: FindManyOptions): void {
    // Process with[] array of relation names
    if(req.query.with !== undefined) {
      let w: string[] = []
      if(!Array.isArray(req.query.with)) {
        w.push(req.query.with.toString());
      } else {
        w = <string[]>req.query.with;
      }
      w.forEach((rel, idx, a) => {
        let nested: string[] = [];
        if(rel.indexOf('.') !== -1) {
          let item: string = a.splice(idx, 1)[0];
          let parts: string[] = item.split('.');
          let cumulativeRelation: string[] = [];
          let part: string = '';
          while(part = parts.shift()) {
            cumulativeRelation.push(part);
            nested.push(cumulativeRelation.join('.'));
          }
        }
        a.splice(idx,0,...nested);
      });
      w = w.filter(uniqueFilter);
      options.relations = w;
    }
  }
}

