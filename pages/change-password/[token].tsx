import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import { createUrqlClient } from '../../utils/createUrqlClient'
import ChangePasswordForm from '../../components/change-password/ChangePasswordForm'

interface ChangePasswordProps {
   token: string
}

const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
   return (
      <div className='py-8 flex justify-center'>
         <div className="">
            <div className="">
               <span className="text-lg font-semibold">
                  Change password
               </span>
            </div>
            <div className="w-[420px]">
               <ChangePasswordForm token={token} />
            </div>
         </div>
      </div>
   )
}

ChangePassword.getInitialProps = (ctx) => {
   return {
      token: ctx.query.token as string
   }
}

export default withUrqlClient(createUrqlClient)(ChangePassword)