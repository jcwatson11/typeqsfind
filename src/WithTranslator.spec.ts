import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindManyOptions} from 'typeorm';
import {expect} from 'chai';
import {Request} from 'express';
import {typeqs} from './typeqs';
const qt = typeqs.TranslateQuery;

describe('With WithTranslator,', function() {

  describe('if the with parameter is not an array, it', function() {
    it('can properly try to assimilate it into the find options', function() {
      let req: any = {query:{}} as Request;
      let expectedOptions: any = {
        "relations": [
          "Alternate"
        ]
        ,"skip": 0
        ,"take": 10
      } as FindManyOptions;
      req.query.with = 'Alternate';
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });
  describe('while parsing with[], it', function() {
    it('can properly translate singular relation requests', function() {
      let req: any = {query:{}} as Request;
      let expectedOptions: any = {
        "relations": [
          "Alternate"
          ,"MergedWith"
        ]
        ,"skip": 0
        ,"take": 10
      } as FindManyOptions;
      req.query.with = ['Alternate','MergedWith'];
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly translate nested relation requests', function() {
      let req: any = {query:{}} as Request;
      let expectedOptions: any = {
        "relations": [
          "Alternate"
          ,"Alternate.MergedWith"
          ,"Alternate.MergedWith.Person"
          ,"Secondary"
        ]
        ,"skip": 0
        ,"take": 10
      } as FindManyOptions;
      req.query.with = ['Alternate.MergedWith.Person','Secondary'];
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

});

