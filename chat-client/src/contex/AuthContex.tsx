import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from 'react';
  import { gql, useApolloClient } from '@apollo/client';
  import { authService } from '../services/authService';
  
  type User = {
    name: string;
    email: string;
  };
  
  type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const client = useApolloClient();
    const [user, setUser] = useState<User | null>(null);
  
    const loadUser = async () => {
      const token = authService.getToken();
      if (!token) return;
  
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
            fetchPolicy: 'no-cache',
        });
        setUser(data.me);
      } catch (error) {
        console.error('Error cargando usuario:', error);
        authService.removeToken();
        setUser(null);
      }
    };
  
    const login = async (token: string) => {
      authService.setToken(token);
      await loadUser();
    };
  
    const logout = () => {
      authService.removeToken();
      setUser(null);
    };
  
    useEffect(() => {
      loadUser();
    }, []);
  
    return (
      <AuthContext.Provider
        value={{ user, isAuthenticated: !!user, login, logout }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
  };
  