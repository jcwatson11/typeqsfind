/// <reference types="@types/express" />
/// <reference types="typeorm" />
declare global {
  namespace typeqs {
    export typeqs.TranslateQuery(req: Request): FindManyOptions;
  }
}
