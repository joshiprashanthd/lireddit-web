import { QueryInput, Cache } from '@urql/exchange-graphcache'

export function betterUpdateQuery<R, Q>(
    cache: Cache,
    input: QueryInput,
    result: any,
    fn: (r: R, q: Q) => Q
) {
    return cache.updateQuery(input, (data) => fn(result, data as any) as any)
}
