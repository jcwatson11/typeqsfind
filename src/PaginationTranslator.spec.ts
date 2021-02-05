import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindManyOptions} from 'typeorm';
import {expect} from 'chai';
import {Request} from 'express';
import {typeqs} from './typeqs';
const qt = typeqs.TranslateQuery;

describe('With PaginationTranslator,', function() {

  describe('while processing limit and offset, it', function() {
    it('can properly default the skip and take options', function() {
      let req: any = {query:{}} as Request;
      let expectedOptions: any = {
         "skip": 0
        ,"take": 10
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set the skip and take options with limit and offset', function() {
      let req: any = { query: {} } as Request;
      req.query.limit = 20;
      req.query.offset = 40;
      let expectedOptions: any = {
         "skip": 40 
        ,"take": 20
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set the skip and take options with start and limit', function() {
      let req: any = { query: {} } as Request;
      req.query.limit = 20;
      req.query.start = 40;
      let expectedOptions: any = {
         "skip": 40 
        ,"take": 20
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

});

