import { CircularProgress } from '@mui/material'
import React from 'react'

const Loader: React.FC = () => {
   return (
      <div className="flex items-center justify-center">
         <div className="relative ">
            <CircularProgress
               className='z-10 relative'
               disableShrink
               sx={{
                  animationDuration: '600ms'
               }}
            />
            <CircularProgress
               className='absolute text-gray-200 left-0 top-0'
               thickness={4}
               variant='determinate'
               value={100}
            />
         </div>
      </div>
   )
}

export default Loader