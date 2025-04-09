import { FC } from 'react';
import {Link} from 'react-router-dom'


type Props = {
  
};

const NavBar:FC = () => {
  return (<>

    <nav>
    
    <Link to="login">Login </Link>
    <Link to={"chats"}>Chats</Link>
     
    
    </nav>
  
  
  
  </>);


}

export default NavBar;