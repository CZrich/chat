import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './services/apolloClient.ts'
import { AuthProvider } from './contex/AuthContex.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

   

    <ApolloProvider client={apolloClient}>
      <AuthProvider>

     
      <App/>

      </AuthProvider>
      
    </ApolloProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
