

import {createBrowserRouter,RouterProvider} from 'react-router-dom'
//import { Layout } from '../Layouts/Layout';
import { NoFound } from '../pages/NoFound';
import { Chat } from '../pages/Chats';
import { Welcome}  from '../pages/Welcome';




export const Routes =() =>{

  const route = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />, // sin Layout
    },
    {
      path: "chats",
      element: <Chat/>,
     
    },
    {
      path: "*",
      element: <NoFound />,
    },
  ]);
  
  return (<RouterProvider router={route}>
      
  </RouterProvider>

  );
}