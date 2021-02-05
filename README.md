# TypeORM Query String Translator

Translates the HTTP Query String from an Express Request object to a TypeORM FindManyOptions object.

## Installation

```bash
npm i -S typeqsfind
```

## Usage

The example below presumes that you have a database configured with a single table named 'user'

ID | Name | Level
---|------|------
1 | Jon | 9
2 | Nancy | 11

```TypeScript
import {typeqs} from "typeqsfind";
import {FindManyOptions, createConnection, Repository} from "typeorm";
import express from "express";
import {Request, Response} from "express";
import {User} from "./entity/User";
import ormconfig from "./ormconfig";

const app = express();

let conn = await createConnection(ormconfig);

app.get("/users", async (req: Request, res: Response) => {
    let myOptions: FindManyOptions = typeqs.TranslateQuery(request);

    // myOptions is now a TypeORM FindManyOptions object taken from the query string
    let repo = getRepository(User);
    let results = await repo.find(myOptions);
    return results;
});

app.listen(3000);

```
## Example Queries
```
GET http://localhost:3000/users?whereName=Jon
// Returns record 1
```
```
GET http://localhost:3000/users?whereName=Nancy
// Returns record 2
```
```
GET http://localhost:3000/users?greaterthanLevel=10
// Returns record 2
```

## Production warning
This code is in experimental status. Using this code in production should only happen if you have completed extensive testing after integration with your own software.

## Supported features

- Supports referencing nested relationships from the query string.
- Supports all common simple clause types (listed below)
- Supports sending a JSON object either encoded on the query string, or in the request body that will become the options object that you want. This is used as a starting point (if provided) to add more parameters to as provided from the query string.
- Supports typescript.
- Preliminary tests have been completed.

## Supported Query String Operators

The following query string parameters are supported, and will be translated in the following ways:

`NOTE: The query string examples in the Example column have not been properly URLEncoded. Please always make sure your query strings are properly encoded.`

Prefix | SQL equivalent | Query String Example
-------|-------------|--------
limit | LIMIT ? (Default 10) | ?limit=100
where | WHERE Name = ? | ?whereName=Jon
orwhere | WHERE (Name = ? OR Name = ? | ?orwhereName[]=Jon&orwhereName[]=Nancy
inarray | WHERE Name IN (?,?) | ?inarrayName[]=Jon&inarrayName[]=Nancy
notinarray | WHERE Name NOT IN (?,?) | ?notinarrayName[]=Jon&notinarrayName[]=Nancy
between | WHERE Name BETWEEN ? AND ? | ?betweenLevel[]=4&betweenLevel[]=10
isnull | WHERE Name IS NULL | ?isnullName
isnotnull | WHERE Name IS NOT NULL | ?isnotnullName
like | WHERE Name LIKE ? | ?likeName=%Jon%
ilike | WHERE Name ILIKE ? | ?ilikeName=%jon%
greaterthan | WHERE Level > ? | ?greaterthanLevel=10
greaterthanorequalto | WHERE Level >= ? | ?greaterthanorequaltoLevel=10
lessthan | WHERE Level < ? | ?lessthanLevel=10
lessthanorequalto | WHERE Level <= ? | ?lessthanorequaltoLevel=10

## Referencing Nested Relations

Nested relations can be referenced with a dot operator between relation names and field names.

Consider a fundraiser schema as follows:

### Table Beneficiaries

BenficiaryId | FirstName | LastName | Phone
-------------|-----------|----------|------
1 | Jon | Watson | 555-1212
2 | Sherlock | Holmes | 555-2121

### Table Sponsors

SponsorId | FirstName | LastName | Phone | AmountCommitted | BeneficiaryId
----------|-----------|----------|-------|-----------------|--------------
1 | Jill | Clemons | 555-1111 | 300 | 1
2 | Fred | Baker | 555-2222 | 200 | 2

```
http://localhost:3000/beneficiaries?greaterthanSponsors.AmountCommitted=250
// Returns Beneficiary 1
```
