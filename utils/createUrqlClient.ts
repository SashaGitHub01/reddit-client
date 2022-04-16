import { cacheExchange, Entity, Resolver } from "@urql/exchange-graphcache"
import { dedupExchange, fetchExchange, gql, stringifyVariables } from "urql"
import {
   DeletePostMutationVariables,
   LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutation, VoteMutationVariables,
} from "../generated/graphql"
import { isServer } from "./isServer";
import { updQuery } from "./updQuery"

export interface PaginationParams {
   cursorArgument?: string;
}

export const simplePagination = (): Resolver<any, any, any> => {
   return (_parent, fieldArgs, cache, info) => {
      const { parentKey: entityKey, fieldName } = info;

      const allFields = cache.inspectFields(entityKey);
      const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
      const size = fieldInfos.length;

      if (size === 0) {
         return undefined;
      }

      const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
      const isCached = cache.resolve(cache.resolve(entityKey, fieldKey) as Entity, 'posts')
      const result: string[] = []
      let hasMore = true
      info.partial = !isCached

      fieldInfos.forEach(fi => {
         const key = cache.resolve(entityKey, fi.fieldKey)
         const data = cache.resolve(key as Entity, 'posts') as string[]
         const _hasMore = cache.resolve(key as Entity, 'hasMore') as boolean

         if (!_hasMore) {
            hasMore = _hasMore
         }

         result.push(...data)
      })

      return {
         __typename: 'PaginationPosts',
         hasMore,
         posts: result
      }
      //   const visited = new Set();
      //   let result: NullArray<string> = [];
      //   let prevOffset: number | null = null;

      //   for (let i = 0; i < size; i++) {
      //     const { fieldKey, arguments: args } = fieldInfos[i];
      //     if (args === null || !compareArgs(fieldArgs, args)) {
      //       continue;
      //     }

      //     const links = cache.resolve(entityKey, fieldKey) as string[];
      //     const currentOffset = args[offsetArgument];

      //     if (
      //       links === null ||
      //       links.length === 0 ||
      //       typeof currentOffset !== 'number'
      //     ) {
      //       continue;
      //     }

      //     const tempResult: NullArray<string> = [];

      //     for (let j = 0; j < links.length; j++) {
      //       const link = links[j];
      //       if (visited.has(link)) continue;
      //       tempResult.push(link);
      //       visited.add(link);
      //     }

      //     if (
      //       (!prevOffset || currentOffset > prevOffset) ===
      //       (mergeMode === 'after')
      //     ) {
      //       result = [...result, ...tempResult];
      //     } else {
      //       result = [...tempResult, ...result];
      //     }

      //     prevOffset = currentOffset;
      //   }

      //   const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
      //   if (hasCurrentPage) {
      //     return result;
      //   } else if (!(info as any).store.schema) {
      //     return undefined;
      //   } else {
      //     info.partial = true;
      //     return result;
      //   }
   };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
   let cookie = ''

   if (isServer() && ctx) {
      cookie = ctx.req.headers?.cookie //cookie for SSR
   }

   return {
      url: process.env.NEXT_PUBLIC_SERVER as string,
      fetchOptions: {
         credentials: 'include' as const,
         headers: cookie ? {
            cookie
         } : undefined
      },
      exchanges: [
         dedupExchange,
         cacheExchange({
            resolvers: {
               Query: {
                  posts: simplePagination()
               }
            },
            updates: {
               Mutation: {
                  login: (result, args, cache, info) => {
                     updQuery<LoginMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        result as LoginMutation,
                        (res, query) => {
                           return { me: res.login }
                        })
                  },

                  registration: (result, args, cache, info) => {
                     updQuery<RegisterMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        result as RegisterMutation,
                        (res, query) => {
                           return { me: res.registration }
                        })
                  },

                  logout: (result, args, cache, info) => {
                     updQuery<LogoutMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        result as LogoutMutation,
                        (_res, _query) => {
                           console.log(cache.resolve('Query', 'me'))
                           return { me: null }
                        }
                     )
                  },

                  vote: (_result, args, cache, info) => {
                     const { vote } = _result as VoteMutation
                     const { postId } = args as VoteMutationVariables
                     const data = cache.readFragment(gql`
                        fragment _ on Post {
                           id
                           points
                        }
                     `, { id: postId })

                     if (data) {
                        cache.writeFragment(gql`
                        fragment __ on Post {
                           id
                           points
                           voteStatus
                        }
                     `, { id: postId, points: vote.newPoints, voteStatus: vote.voteStatus })
                     }
                  },

                  createPost: (result, args, cache, info) => {
                     const all = cache.inspectFields('Query')
                     const fieldInfos = all.filter(i => i.fieldName === 'posts')
                     fieldInfos.forEach(field => {
                        cache.invalidate('Query', 'posts', field.arguments)
                     })
                  },

                  deletePost: (result, args: DeletePostMutationVariables, cache, info) => {
                     cache.invalidate({ __typename: 'Post', id: args.id })
                  },
               }
            }
         }),
         ssrExchange,
         fetchExchange]
   }
}