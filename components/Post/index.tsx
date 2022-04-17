import Link from 'next/link';
import React from 'react'
import PostActions from './PostActions';
import UpdootsSection from './UpdootsSection';

interface PostProps {
   createdAt: string;
   creatorId: number;
   id: number;
   points: number;
   text: string;
   title: string;
   voteStatus?: number | null;
   isMy: boolean
}

const Post: React.FC<PostProps> = ({ createdAt, creatorId, isMy, id, text, title, voteStatus, points }) => {
   return (
      <div className="rounded border border-solid border-gray-400 pr-3 relative">
         <div className="flex">
            <div className="bg-gray-100 flex items-center justify-center px-2">
               <UpdootsSection points={points} status={voteStatus} id={id} />
            </div>
            <div className="flex flex-col flex-auto">
               <div className="flex-auto py-4 px-2 ">
                  <div className="">
                     <Link href={'/post/[id]'} as={`/post/${id}`}>
                        <a className="font-main font-semibold hover:underline leading-6 mb-1">
                           {title}
                        </a>
                     </Link>
                  </div>
                  <div className="flex-auto">
                     <pre className="font-sans font-sm font-light whitespace-normal leading-5">
                        {text}
                     </pre>
                  </div>
               </div>
               <div className="px-2">
                  <PostActions isMy={isMy} id={id} link={true} />
               </div>
            </div>
         </div>
      </div>
   )
}

export default Post