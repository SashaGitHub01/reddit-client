import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'
import { useMeQuery, usePostsQuery } from '../../../generated/graphql'
import Loader from '../../Loader'
import Post from '../../Post'

const PostsList: React.FC = () => {
   const [vars, setVars] = useState<{ limit: number, offset: number }>({ limit: 10, offset: 1 })
   const [{ data, fetching }] = usePostsQuery({
      variables: vars
   })
   const [{ data: meData }] = useMeQuery()

   const handleShow = () => {
      setVars({ ...vars, offset: vars.offset + 1 })
   }

   return (
      <div className='py-4 flex flex-col gap-6'>
         {fetching
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
                           loading={fetching}
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