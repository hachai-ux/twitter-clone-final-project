import { Link } from 'react-router-dom';
import Logout from './Logout';
import twitterCloneLogo from '../content/Twitter-Emblem.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser} from '@fortawesome/free-solid-svg-icons'


const Nav = (props) => {
   
    console.log(props.username);

    const usernamePath = `/${props.username}`;

    return (
        <nav>
           
    
            <ul className="nav-links">
                <li >
                    <Link to='/home'><img src={twitterCloneLogo} alt="Twitter Clone Logo" width="26" height="26"></img>
                    </Link>
                </li>
                <li>
                    <Link to='/home'><FontAwesomeIcon icon={faHome} />
                    </Link>
                </li>
                <li>
                    <Link to={usernamePath}><FontAwesomeIcon icon={faUser} />
                    </Link>
                </li>
                         <li>
                    <Logout changeRoutesId={props.changeRoutesId} resetUsername={props.resetUsername}/>
                </li>
               
                
            </ul>


            
        </nav>
    );
};

export default Nav;