import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'
import { PostsQuery, useMeQuery, usePostsQuery } from '../../../generated/graphql'
import Loader from '../../Loader'
import Post from '../../Post'

const PostsList: React.FC = () => {
   const [vars, setVars] = useState<{ limit: number, offset: number }>({ limit: 10, offset: 1 })
   const { data, loading, fetchMore } = usePostsQuery({
      variables: { limit: 10, offset: 1 }
   })
   const { data: meData } = useMeQuery()

   const handleShow = async () => {
      await fetchMore({
         variables: {
            ...vars, offset: vars.offset + 1
         },
      })
      setVars({ ...vars, offset: vars.offset + 1 })
   }

   return (
      <div className='py-4 flex flex-col gap-6'>
         {loading
            ? <Loader />
            : data
               ? <>
                  {data.posts?.posts?.map((post) => (
                     <Post {...post} isMy={meData?.me?.id === post.creatorId} key={post.id} />
                  ))}
                  {data.posts.hasMore
                     && <div className="flex justify-center py-2">
                        <LoadingButton
                           onClick={handleShow}
                           loading={loading}
                           className='bg-btn_primary'
                           variant='contained'
                        >
                           Show more
                        </LoadingButton>
                     </div>}
               </>
               : <div className='text-center text-gray-400 font-light text-md'>
                  There's no posts
               </div>}
      </div>
   )
}

export default PostsList