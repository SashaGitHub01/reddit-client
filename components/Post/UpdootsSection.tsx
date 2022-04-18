import { IconButton } from '@mui/material'
import React from 'react'
import UpIcon from '@mui/icons-material/ExpandLess';
import DownIcon from '@mui/icons-material/ExpandMore';
import { useVoteMutation, VoteMutation } from '../../generated/graphql';
import { ApolloCache, FetchResult, gql } from '@apollo/client';

interface UpdootsSectionProps {
   points: number,
   id: number,
   status?: null | number
}

const updateVoteCache = (
   postId: number,
   cache: ApolloCache<VoteMutation>,
   result: Omit<FetchResult<VoteMutation>, "context">
) => {
   const { data: resData } = result;
   const data = cache.readFragment({
      id: `Post:${postId}`,
      fragment: gql`
          fragment _ on Post {
            id
            points
         }     
         `,
   })

   if (data) {
      cache.writeFragment({
         id: `Post:${postId}`,
         fragment: gql`
            fragment __ on Post {
               points
               voteStatus
            }`,
         data: { points: resData?.vote.newPoints, voteStatus: resData?.vote.voteStatus }
      })
   }
}


const UpdootsSection: React.FC<UpdootsSectionProps> = ({ points, id, status }) => {
   const [fetchVote, { loading }] = useVoteMutation()

   const handleUp = async () => {
      if (status === 1) return;

      try {
         await fetchVote({
            variables: {
               postId: id,
               value: 1
            },

            update: (cache, result) => updateVoteCache(id, cache, result)
         })
      } catch (err: any) {
         console.log(err.message);
      }
   }

   const handleDown = async () => {
      if (status === -1) return;

      try {
         await fetchVote({
            variables: {
               postId: id,
               value: -1
            },

            update: (cache, result) => updateVoteCache(id, cache, result)
         })
      } catch (err: any) {
         console.log(err.message);
      }
   }

   return (
      <div className="flex flex-col items-center justify-center relative z-20">
         <IconButton
            className=""
            size='small'
            onClick={handleUp}
            disabled={loading}
         >
            <UpIcon className={`text-[40px]  ${status === 1 ? 'text-green-500' : 'text-gray-500'}`} />
         </IconButton >
         <div className="">
            <span className="text-center leading-6">
               {points}
            </span>
         </div>
         <IconButton
            className=""
            size='small'
            onClick={handleDown}
            disabled={loading}
         >
            <DownIcon className={`text-[40px]  ${status === -1 ? 'text-red-400' : 'text-gray-500'}`} />
         </IconButton>
      </div>
   )
}

export default UpdootsSection