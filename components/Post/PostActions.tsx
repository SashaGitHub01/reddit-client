import React from 'react'
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material'
import CommentIcon from '@mui/icons-material/ModeComment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface PostActionsProps {
   isMy: boolean,
   onOpen?: () => void
}

const PostActions: React.FC<PostActionsProps> = ({ isMy, onOpen }) => {
   return (
      <div className="py-3">
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
                  <IconButton onClick={onOpen}>
                     <EditIcon />
                  </IconButton>
                  <IconButton>
                     <DeleteIcon />
                  </IconButton>
               </div>
               : null}
         </div>
      </div>
   )
}

export default PostActions