import { IconButton } from '@mui/material'
import React from 'react'
import UpIcon from '@mui/icons-material/ExpandLess';
import DownIcon from '@mui/icons-material/ExpandMore';
import { useVoteMutation } from '../../generated/graphql';

interface UpdootsSectionProps {
   points: number,
   id: number,
   status?: null | number
}

const UpdootsSection: React.FC<UpdootsSectionProps> = ({ points, id, status }) => {
   const [{ fetching }, fetchVote] = useVoteMutation()

   const handleUp = async () => {
      if (status === 1) return;

      await fetchVote({
         postId: id,
         value: 1
      })
   }

   const handleDown = async () => {
      if (status === -1) return;

      await fetchVote({
         postId: id,
         value: -1
      })
   }

   return (
      <div className="flex flex-col items-center justify-center relative z-20">
         <IconButton
            className=""
            size='small'
            onClick={handleUp}
            disabled={fetching}
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
            disabled={fetching}
         >
            <DownIcon className={`text-[40px]  ${status === -1 ? 'text-red-400' : 'text-gray-500'}`} />
         </IconButton>
      </div>
   )
}

export default UpdootsSection