import React from 'react'
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar';

function Layout() {
    return (
        <div className="grid grid-cols-12">
            {/* Sidebar */}
            <div className="absolute z-50 w-full col-span-12 md:static md:col-span-2  ">
                <SideBar />
            </div>

            {/* Content */}
            <div className="relative z-0 col-span-12 md:static md:col-span-10 ">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout