import React, { useEffect } from 'react'
import LoginForm from '../components/Login/LoginForm'
import Wrapper from '../components/Wrapper'
import { useMeQuery } from '../generated/graphql'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import Link from 'next/link'

const Login: React.FC = () => {
   const router = useRouter()
   const [{ data }] = useMeQuery()

   useEffect(() => {
      if (!!data?.me) router.push('/')
   }, [data])

   return (
      <Wrapper>
         <div className="flex-auto flex-col flex items-center justify-center">
            <div className="text-center font-semibold py-4 text-lg">
               <span>
                  Login
               </span>
            </div>
            <div className="flex justify-center max-w-[420px] w-full">
               <LoginForm />
            </div>
            <div className="text-sm">
               Don't have an account?
               <Link href={'/registration'}>
                  <span className='ml-1 text-blue-400 cursor-pointer'>
                     Sign Up.
                  </span>
               </Link>
            </div>
         </div>
      </Wrapper>
   )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Login)