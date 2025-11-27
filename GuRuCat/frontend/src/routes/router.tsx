import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Layout from '../layouts/layout'
import Predict from '../pages/Predict'
import Gps from '../pages/gps'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Predict/> },
            { path: 'GPS', element: <Gps /> },
        ]
    }
])

function Router() {
    return <RouterProvider router={router} />
}

export default Router
