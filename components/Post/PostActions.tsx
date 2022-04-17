import React from 'react'
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material'
import CommentIcon from '@mui/icons-material/ModeComment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeletePostMutation } from '../../generated/graphql';
import Link from 'next/link';

interface PostActionsProps {
   isMy: boolean,
   onOpen?: () => void, //if path == /post/:id
   id: number,
   link?: boolean //if homepage
}

const PostActions: React.FC<PostActionsProps> = ({ isMy, onOpen, id }) => {
   const [{ fetching }, fetchDelete] = useDeletePostMutation()

   const handleDelete = async () => {
      await fetchDelete({
         id
      })
   }

   return (
      <div className={`py-3 ${fetching ? 'pointer-events-none' : ''}`}>
         <div className="flex items-center justify-between gap-1">
            <Button className='flex items-center' color='myGray'>
               <CommentIcon color='action' />
               <div className="ml-1">
                  <span className="">
                     Comments
                  </span>
               </div>
            </Button>
            {isMy
               ? <div className="flex gap-3">
                  <Link href={'/post/[id]?edit=true'} as={`/post/${id}?edit=true`}>
                     <IconButton onClick={onOpen}>
                        <EditIcon />
                     </IconButton>
                  </Link>
                  <IconButton onClick={handleDelete}>
                     <DeleteIcon />
                  </IconButton>
               </div>
               : null}
         </div>
      </div>
   )
}

export default PostActions