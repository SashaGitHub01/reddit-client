import React from 'react'
import ForgotPasswordForm from '../../components/forgot-password/ForgotPasswordForm'
import Wrapper from '../../components/Wrapper'
import { withApollo } from '../../utils/withApollo'

const ForgotPassword: React.FC = () => {
   return (
      <Wrapper>
         <div className='py-8 flex justify-center'>
            <div className="">
               <div className="">
                  <span className="text-lg font-semibold">
                     Forgot password
                  </span>
               </div>
               <div className="w-[420px]">
                  <ForgotPasswordForm />
               </div>
            </div>
         </div>
      </Wrapper>
   )
}

export default withApollo({ ssr: false })(ForgotPassword)