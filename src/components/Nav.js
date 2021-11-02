import { Link } from 'react-router-dom';
import Logout from './Logout';

const Nav = () => {
    return (
        <nav>
            <h3>Twitter</h3>
    
                <ul className="nav-links">
                <li>
                <Link to='/'>Home</Link>
                </li>
                <li>
                <Link to='/profile'>Profile</Link>
                </li>
                <li>
                <Link to='/signup'>TempSignUp</Link>
                </li>
                <li>
                <Link to='/login'>TempLogin</Link>
                </li>
                <li>
                    <Logout />
                </li>
                
            </ul>


            
        </nav>
    );
};

export default Nav;