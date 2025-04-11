import { useGoogleLogin } from '@react-oauth/google';

import { useApolloClient, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogleCode } from '../services/auth';
import { authService } from '../services/authService';

export const Login = () => {
  const client = useApolloClient();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    
    flow: 'auth-code',
    onSuccess: async (tokenResponse) => {
      try{
      const code = tokenResponse.code;
     
      console.log('Got Google code, exchanging for JWT...');
       const jwt = await loginWithGoogleCode(code);
        alert('JWT: ' + jwt);
       if(!jwt) {


        console.error('Error al obtener el token JWT');
        return;
       }
        
      console.log('JWT received, storing token');
       authService.setToken(jwt);
      // Test if token works with a GraphQL query
      //Test the token
      console.log('Testing token with me query...');
      try {
        const { data } = await client.query({
          query: gql`
            query {
              me {
                name
                email
              }
            }
          `,
          fetchPolicy:'no-cache',
        });
        
        console.log('User data from server:', data.me);
        navigate('/chats');
      } catch (queryError) {
        console.error('GraphQL query failed with token:', queryError);
      }
    } catch (err) {
      console.error('Login process error:', err);
    }
    },
    onError: (err) => {
      console.error('Error en login', err);
    },
  
  //prompt: 'consent', // Asegura que siempre muestre el diálogo de consentimiento
  //scope: 'email profile'
    //redirect_uri: window.location.origin + '/oauth/callback',
    
  //ux_mode: 'popup',
 ux_mode: 'redirect',
redirect_uri: window.location.origin + '/oauth/callback'
  });

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => login()}>Iniciar sesión con Google</button>
    </div>
  );
};
