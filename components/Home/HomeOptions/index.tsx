import React, { useState } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import { Dialog, IconButton, Tooltip, DialogContent } from '@mui/material';
import PostForm from './PostForm';

const HomeOptions: React.FC = () => {
   const [create, setCreate] = useState(false)

   const openPostForm = () => {
      setCreate(true)
   }

   const closePostForm = () => {
      setCreate(false)
   }

   return (
      <div className=''>
         <div className="">
            <Tooltip title='Create post' placement='bottom' arrow>
               <IconButton className="" onClick={openPostForm}>
                  <CreateIcon />
               </IconButton>
            </Tooltip>
            <Dialog
               open={create}
               onClose={closePostForm}
               fullWidth maxWidth='sm'
            >
               <div className='font-medium text-md px-5 py-4'>
                  <span>
                     Create Post
                  </span>
               </div>
               <DialogContent className=''>
                  <PostForm onCancel={closePostForm} />
               </DialogContent>
            </Dialog>
         </div>
      </div>
   )
}

export default HomeOptions