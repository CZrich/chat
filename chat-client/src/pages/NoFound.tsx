import {Link} from 'react-router-dom'


type Props = {
  
};

export function NoFound(props: Props) {

    //let navigate= useNavigate();
  return (
    <div>
        <h3>No founf page</h3>

        <Link to="/"> Back</Link>
        
    </div>
  );
}