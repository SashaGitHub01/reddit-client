import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { withApollo as createWithApollo } from "next-apollo";
import { PaginationPosts, Post } from "../generated/graphql";

const createClient = (ctx: NextPageContext) => new ApolloClient({
   uri: process.env.NEXT_PUBLIC_SERVER,
   credentials: 'include',
   headers: {
      cookie: (typeof window === 'undefined' ? ctx?.req?.headers.cookie : undefined) || ''
   },
   cache: new InMemoryCache({
      typePolicies: {
         Query: {
            fields: {
               'posts': {
                  keyArgs: false,
                  merge: (existing: PaginationPosts, incoming: PaginationPosts): PaginationPosts => {
                     return {
                        __typename: 'PaginationPosts',
                        posts: [
                           ...(existing?.posts || []),
                           ...incoming.posts
                        ] as Post[],
                        hasMore: incoming.hasMore
                     }
                  }
               }
            }
         }
      }
   })
})

export const withApollo = createWithApollo(createClient)