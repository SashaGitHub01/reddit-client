import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Loader from '../../components/Loader'
import UpdootsSection from '../../components/Post/UpdootsSection'
import PostActions from '../../components/Post/PostActions'
import Wrapper from '../../components/Wrapper'
import { useMeQuery, usePostQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import EditForm from '../../components/Post/EditForm'

const Post = () => {
   const [isEdit, setIsEdit] = useState(false)
   const router = useRouter()
   const postId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;

   const [{ data: meData }] = useMeQuery()
   const [{ data, fetching }] = usePostQuery({
      pause: postId === -1,
      variables: {
         id: postId
      }
   })

   const openEditor = () => {
      setIsEdit(true)
   }

   const closeEditor = () => {
      setIsEdit(false)
   }

   return (
      <Wrapper>
         <div className="flex-auto rounded-md bg-gray-100 py-5 px-4">
            {fetching
               ? <Loader />
               : !!data?.post
                  ? <div className="flex">
                     <div className="mr-2">
                        <UpdootsSection
                           points={data.post.points}
                           id={data.post.id}
                           status={data.post.voteStatus}
                        />
                     </div>
                     <div className="flex-auto">
                        <div className="">
                           <div className="">
                              <div className="">
                                 <h6 className="text-main font-medium pb-2">
                                    {data?.post.title}
                                 </h6>
                              </div>
                              {isEdit
                                 ? <EditForm
                                    id={data.post.id}
                                    defaultValue={data.post.text}
                                    onCancel={closeEditor}
                                 />
                                 : <pre className="text-sm font-sans font-light whitespace-pre-line leading-5">
                                    {data?.post.text}
                                 </pre>}
                           </div>
                        </div>
                        <PostActions
                           isMy={meData?.me?.id === data.post.creatorId}
                           onOpen={openEditor}
                        />
                     </div>
                  </div>
                  : null}
         </div>
      </Wrapper>
   )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)