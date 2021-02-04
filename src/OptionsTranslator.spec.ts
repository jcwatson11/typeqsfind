import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindManyOptions} from 'typeorm';
import {expect} from 'chai';
import {Request} from 'express';
import {TranslateQuery} from './index';
const qt = TranslateQuery;

describe('With OptionsTranslator,', function() {

  describe('when providing an encoded options json object, it', function() {
    it('can decode and set the options properly', function() {
      let req: any = { query: {} } as Request;
      req.query.options = 'eyJza2lwIjogMCwgInRha2UiOiAxMCwgIm9yZGVyIjogeyAiZmllbGQxIjogIkRFU0MiIH19';
      let expectedOptions: any = {
         order: {
           field1: 'DESC'
        }
        ,skip: 0 
        ,take: 10
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly throws an error if the JSON cannot be parsed', function() {
      let req: any = { query: {} } as Request;
      req.query.options = 'eyJza2lwIjogMCwgInRha2UiOiAxMCwgIm9yZGVyIjogeyAiZmllbGQxIjogIkRFU0MiI';
      try {
        qt(req);
      } catch(e) {
        expect(e.toString()).to.equal('JSON options input could not be parsed properly. SyntaxError: Unexpected end of JSON input');
      }
    });

    it('can set options properly from the request body', function() {
      let req: any = { query: {} } as Request;
      req.method = 'GET';
      req.body = {
         order: {
           field1: 'DESC'
        }
        ,skip: 0 
        ,take: 10
      };
      let expectedOptions: any = {
         order: {
           field1: 'DESC'
        }
        ,skip: 0 
        ,take: 10
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

  });

});

