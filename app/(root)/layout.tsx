
import Header from '@/components/Header';
import MobileNavigation from '@/components/MobileNavigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser();
console.log(currentUser,"curent user");

    // If no authenticated user, redirect to sign-in
    if (!currentUser) {
        redirect('/sign-in');
    }

    // Render the layout with current user props
    return (
        <main className="flex h-screen">
            <Sidebar {...currentUser} />
            <section className="flex h-full flex-1 flex-col">
                <MobileNavigation {...currentUser} />
                <Header />
                <div className="main-content">{children}</div>
            </section>
        </main>
    );
};

export default Layout;
