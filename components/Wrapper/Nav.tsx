import React, { useEffect, useState } from 'react'
import { useLogoutMutation, useMeQuery } from '../../generated/graphql'
import { User } from '../../types/User'
import Link from 'next/link'
import logo from '../../assets/logo.png'

const Nav = () => {
   const [user, setUser] = useState<User | null>(null)
   const [{ fetching }, fetchLogout] = useLogoutMutation()
   const [{ data }, fetchMe] = useMeQuery()

   useEffect(() => {
      fetchMe()
   }, [])

   useEffect(() => {
      if (!!data?.me) setUser(data?.me)
   }, [data])

   const logout = () => {
      setUser(null)
      fetchLogout()
   }

   return (
      <header className="px-5 py-2 bg-amber-200 sticky top-0 z-50">
         <div className="flex items-center justify-between px-5">
            <Link href={'/'}>
               <div className="max-w-[55px] cursor-pointer">
                  <img
                     src={logo.src}
                     alt="logo"
                  />
               </div>
            </Link>
            <nav className="g">
               {user
                  ? <div className="flex items-center gap-4">
                     <div className=''>
                        {user.username}
                     </div>
                     <button className="" disabled={fetching} onClick={logout}>
                        <span className='hover:text-gray-400'>
                           LOGOUT
                        </span>
                     </button>
                  </div>
                  : <Link href={'/login'}>
                     <a>SIGN IN</a>
                  </Link>}
            </nav>
         </div>
      </header>
   )
}

export default Nav