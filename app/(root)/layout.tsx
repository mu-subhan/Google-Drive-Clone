import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'

import React from 'react'

const layout =async ({children} : {children:React.ReactNode}) => {
    const currentUser = await getCurrentUser();
  return (
    <main className='flex h-screen'>
        <Sidebar {...currentUser}/>
<section className='flex h-full flex-1 flex-col'>
    <MobileNavigation/>
     {/* <Header userId={currentUser.$id} accountId={currentUser.accountId} /> */}
    <div className="main-content">
        {children}
    </div>
    </section>      
    </main>
  )
}

export default layout
