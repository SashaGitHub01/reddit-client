import { QueryInput, Cache } from "@urql/exchange-graphcache"

export function updQuery<Result, Query>(
   cache: Cache,
   qi: QueryInput,
   result: Result,
   fn: (r: Result, q: Query) => Query
) {
   return cache.updateQuery(qi, (data) => {
      return fn(result, data as any) as any
   })
}