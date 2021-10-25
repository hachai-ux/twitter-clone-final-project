import { Link } from 'react-router-dom';

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
            </ul>


            
        </nav>
    );
};

export default Nav;