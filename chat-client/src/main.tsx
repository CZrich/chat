import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './services/apolloClient.ts'
import {UserProvider} from './context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
    <ApolloProvider client={apolloClient}>
      <UserProvider>
      <App/>
      </UserProvider>
    </ApolloProvider>
    
  </StrictMode>,
)
