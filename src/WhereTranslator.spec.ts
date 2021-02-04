import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindManyOptions} from 'typeorm';
import {expect} from 'chai';
import {Request} from 'express';
import {typeqs} from './typeqs';
const qt = typeqs.TranslateQuery;

describe('With WhereTranslator,', function() {

  describe('when processing where, it', function() {
    it('can set the where clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query.whereField1 = 'val1';
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Field1": 'val1'
        }
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the orWhere clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query.orwhereField1 = ['val1','val2'];
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": [
           {"Field1": 'val1'}
          ,{"Field1": 'val2'}
        ]
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the nested where clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query['whereAlternate.Field1'] = 'val1';
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Alternate": {
             "Field1": 'val1'
           }
        }
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the nested where clause properly to the 5th level', function() {
      let req: any = { query: {} } as Request;
      req.query['whereAlternate.MergedWith.Alternate.Person.Field1'] = 'val1';
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Alternate": {
             "MergedWith": {
               "Alternate": {
                 "Person": {
                   "Field1": 'val1'
                 }
               }
             }
           }
        }
      } as FindManyOptions;
      let options: FindManyOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

  describe('when processing inarray and notinarray, it', function() {
    it('can set the where clause properly with an array of values', function() {
      let req: any = { query: {} } as Request;
      req.query.inarrayField1 = ['val1', 'val2'];
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Field1": {
             "_type": "in"
             ,"_value": ["val1","val2"]
             ,"_useParameter": true
             ,"_multipleParameters": true
           }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });

    it('can set the nested inarray clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query['inarrayAlternate.Field1'] = ['val1','val2'];
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Alternate": {
             "Field1": {
               "_type": "in"
               ,"_value": ["val1","val2"]
               ,"_useParameter": true
               ,"_multipleParameters": true
             }
           }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });

    it('can set the nested inarray clause properly to the 5th level', function() {
      let req: any = { query: {} } as Request;
      req.query['inarrayAlternate.MergedWith.Alternate.Person.Field1'] = ['val1','val2'];
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Alternate": {
             "MergedWith": {
               "Alternate": {
                 "Person": {
                   "Field1": {
                     "_type": "in"
                     ,"_value": ["val1","val2"]
                     ,"_useParameter": true
                     ,"_multipleParameters": true
                   }
                 }
               }
             }
           }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });

    it('can set the nested notinarray clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query['notinarrayAlternate.MergedWith.Field1'] = ['val1','val2'];
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Alternate": {
             "MergedWith": {
               "Field1": {
                  "_type": "not"
                 ,"_value": {
                   "_type":"in"
                   ,"_value": ["val1","val2"]
                   ,"_useParameter":true
                   ,"_multipleParameters":true
                 }
                 ,"_useParameter": true
                 ,"_multipleParameters": false
               }
             }
           }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });
  });

  describe('when processing isnull, it', function() {
    it('can set the options properly for finding null values', function() {
      let req: any = { query: {} } as Request;
      req.query['isnullAlternate.Person.Field1'] = null;
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Alternate": {
             "Person": {
               "Field1": {
                  "_type": "isNull"
                 ,"_useParameter": false
                 ,"_multipleParameters": false
               }
             }
           }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });
  });

  describe('when processing isnotnull, it', function() {
    it('can set the options properly for finding notnull values', function() {
      let req: any = { query: {} } as Request;
      req.query['isnotnullAlternate.Person.Field1'] = null;
      let expectedOptions: any = {
         "skip": 0 
        ,"take": 10
        ,"where": {
           "Alternate": {
             "Person": {
               "Field1": {
                  "_type":"not"
                 ,"_value": {
                    "_type":"isNull"
                   ,"_useParameter":false
                   ,"_multipleParameters":false
                 }
                 ,"_useParameter":true
                 ,"_multipleParameters":false
               }
             }
           }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });
  });

  describe('when processing between, it', function() {
    it('can set the options properly for finding between values', function() {
      let req: any = { query: {} } as Request;
      req.query['betweenAlternate.Person.DateField'] = ["2010-01-20","2020-01-20"];
      let expectedOptions: any = {
         "skip":0
        ,"take":10
        ,"where": {
          "Alternate": {
            "Person": {
              "DateField": {
                 "_type":"between"
                ,"_value": ["2010-01-20","2020-01-20"]
                ,"_useParameter":true
                ,"_multipleParameters":true
              }
            }
          }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });
  });

  describe('when processing like and ilike, it', function() {
    it('can set the options properly for finding like values', function() {
      let req: any = { query: {} } as Request;
      req.query['likeAlternate.Person.StringField'] = "%name%";
      let expectedOptions: any = {
         "skip":0
        ,"take":10
        ,"where": {
          "Alternate": {
            "Person": {
              "StringField": {
                 "_type":"like"
                ,"_value": "%name%"
                ,"_useParameter": true
                ,"_multipleParameters": false
              }
            }
          }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });

    it('can set the options properly for finding ilike values', function() {
      let req: any = { query: {} } as Request;
      req.query['ilikeAlternate.Person.StringField'] = "%name%";
      let expectedOptions: any = {
         "skip":0
        ,"take":10
        ,"where": {
          "Alternate": {
            "Person": {
              "StringField": {
                 "_type":"ilike"
                ,"_value": "%name%"
                ,"_useParameter": true
                ,"_multipleParameters": false
              }
            }
          }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });
  });

  describe('when processing greaterthan and less than operators, it', function() {
    it('can set the options properly for finding greater than', function() {
      let req: any = { query: {} } as Request;
      req.query['greaterthanAlternate.Person.NumberField'] = 4;
      let expectedOptions: any = {
         "skip":0
        ,"take":10
        ,"where": {
          "Alternate": {
            "Person": {
              "NumberField": {
                 "_type":"moreThan"
                ,"_value": "4"
                ,"_useParameter": true
                ,"_multipleParameters": false
              }
            }
          }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });

    it('can set the options properly for finding greater than or equal to', function() {
      let req: any = { query: {} } as Request;
      req.query['greaterthanorequaltoAlternate.Person.NumberField'] = 4;
      let expectedOptions: any = {
         "skip":0
        ,"take":10
        ,"where": {
          "Alternate": {
            "Person": {
              "NumberField": {
                 "_type":"moreThanOrEqual"
                ,"_value": "4"
                ,"_useParameter": true
                ,"_multipleParameters": false
              }
            }
          }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });

    it('can set the options properly for finding less than', function() {
      let req: any = { query: {} } as Request;
      req.query['lessthanAlternate.Person.NumberField'] = 4;
      let expectedOptions: any = {
         "skip":0
        ,"take":10
        ,"where": {
          "Alternate": {
            "Person": {
              "NumberField": {
                 "_type":"lessThan"
                ,"_value": "4"
                ,"_useParameter": true
                ,"_multipleParameters": false
              }
            }
          }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });

    it('can set the options properly for finding less than or equal to', function() {
      let req: any = { query: {} } as Request;
      req.query['lessthanorequaltoAlternate.Person.NumberField'] = 4;
      let expectedOptions: any = {
         "skip":0
        ,"take":10
        ,"where": {
          "Alternate": {
            "Person": {
              "NumberField": {
                 "_type":"lessThanOrEqual"
                ,"_value": "4"
                ,"_useParameter": true
                ,"_multipleParameters": false
              }
            }
          }
        }
      } as FindManyOptions;
      expectedOptions = JSON.stringify(expectedOptions);
      let options: any = qt(req);
      options = JSON.stringify(options)
      expect(options).to.equal(expectedOptions);
    });

  });

});

