

import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import { Layout } from '../Layouts/Layout';
import { NoFound } from '../pages/NoFound';
import {Login} from '../pages/Login';
import { Chat } from '../pages/Chats';
import { OAuthCallback } from '../components/OauthCallback';



export const Routes =() =>{

  const route=createBrowserRouter([

      {
        path:"/",
        element:<Layout/>,
        errorElement:<NoFound/>,
        children:[
          {
            path:"login",
            element:<Login></Login>
          },
          
          {

            path:"/oauth/callback",
            element:<OAuthCallback/>
          }
          ,
          {

            path:"chats",
            element:<Chat></Chat>
          }
        ]
      },
      {

        path:"*",
        element:<NoFound></NoFound>
      }



  ])
  return (<RouterProvider router={route}>
      
  </RouterProvider>

  );
}