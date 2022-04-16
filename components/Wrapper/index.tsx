import React from 'react'
import Nav from './Nav'

const Wrapper: React.FC = ({ children }) => {
   return (
      <div className="flex-auto flex flex-col">
         <Nav />
         <main className={`flex-auto flex flex-col container py-3 mx-auto px-5 max-w-7xl`}>
            {children}
         </main>
      </div>
   )
}

export default Wrapper