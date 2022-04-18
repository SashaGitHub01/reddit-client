import { withUrqlClient } from 'next-urql'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import RegForm from '../components/Registration/RegForm'
import Wrapper from '../components/Wrapper'
import { useMeQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { withApollo } from '../utils/withApollo'

const Registration: React.FC = () => {
   const router = useRouter()
   const { data } = useMeQuery()

   useEffect(() => {
      if (!!data?.me) router.back()
   }, [data])

   return (
      <Wrapper>
         <div className="flex-auto flex-col flex items-center justify-center">
            <div className="text-center font-semibold py-4 text-xl">
               <span>
                  Registration
               </span>
            </div>
            <div className="flex justify-center max-w-[420px] w-full">
               <RegForm />
            </div>
            <div className="text-sm">
               Have an account?
               <Link href={'/login'}>
                  <span className='ml-1 text-blue-400 cursor-pointer'>
                     Sign In.
                  </span>
               </Link>
            </div>
         </div>
      </Wrapper>
   )
}

export default withApollo({ ssr: false })(Registration)