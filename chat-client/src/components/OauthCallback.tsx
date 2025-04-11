import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useApolloClient, gql } from '@apollo/client';

export const OAuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const client = useApolloClient();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extraer los parámetros de la URL
        //const params = new URLSearchParams(location.hash.substring(1));
        
        const params= new URLSearchParams(location.search);
        const code = params.get('code');
        //const tokenType = params.get('token_type');
        //const expiresIn = params.get('expires_in');
        const errorParam = params.get('error');

        if (errorParam) {
          console.error('Error en la autenticación OAuth:', errorParam);
          setError(`Error de autenticación: ${errorParam}`);
          setLoading(false);
          return;
        }

        if (!code) {
          setError('No se recibió un token de acceso válido');
          setLoading(false);
          return;
        }

        //console.log('Token recibido:', accessToken);
        //console.log('Tipo de token:', tokenType);
        //console.log('Expira en:', expiresIn);

        // Guardar el token en el servicio de autenticación
        authService.setToken(code);

        // Probar consulta "me" para verificar la autenticación
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
          });

          console.log('Usuario autenticado:', data.me);
          
          // Redireccionar al usuario a la página de chats
          navigate('/chats');
        } catch (queryError) {
          console.error('Error al consultar datos del usuario:', queryError);
          setError('Error al verificar la autenticación con el servidor');
          setLoading(false);
        }
      } catch (e) {
        console.error('Error al procesar la redirección OAuth:', e);
        setError('Error al procesar la respuesta de autenticación');
        setLoading(false);
      }
    };

    processCallback();
  }, [location, navigate, client]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl mb-4">Procesando autenticación...</h2>
          <div className="spinner-border" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl text-red-600">Error de autenticación</h2>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => navigate('/login')}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  // Normalmente no llegaríamos aquí ya que redireccionamos en caso de éxito
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl">Autenticación completada</h2>
        <p>Redireccionando...</p>
      </div>
    </div>
  );
};