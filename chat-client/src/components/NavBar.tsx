import { useAuth } from '../contex/AuthContex';
import { Link } from 'react-router-dom';
 export const NavBar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav>
      <Link to="/login">Login</Link>
      <Link to="/chats">Chats</Link>
      {isAuthenticated && (
        <>
          <span>{user?.name}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      )}
    </nav>
  );
};
