import {Request} from 'express';
import {FindManyOptions} from 'typeorm';

export class OptionsTranslator {

  public static decode(jsonString: string): string {
    let buff: Buffer = Buffer.from(jsonString,'base64');
    return buff.toString('utf-8');
  }

  public static hasOptions(req: Request) {
    return (
      req.query.options !== undefined
      || req.body !== {}
    );
  }

  public static translate(req: Request): FindManyOptions {

    // If there was a body to the GET request,
    // we assume that the body is an options object.
    if(req.method === 'GET' && req.body !== {}) {
      let options: FindManyOptions = JSON.parse(JSON.stringify(req.body)) as FindManyOptions;
      return options;
    }
    // process raw options from querystring
    if(req.query.options !== undefined) {
      let optsJson: any = this.decode(req.query.options.toString());
      let options: FindManyOptions;
      try {
        options = JSON.parse(optsJson) as FindManyOptions;
      } catch(e) {
        throw 'JSON options input could not be parsed properly. ' + e.toString();
      }
      return options as FindManyOptions;
    }
    return {} as FindManyOptions;
  }
}

