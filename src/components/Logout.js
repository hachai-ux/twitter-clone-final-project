import { useState} from 'react';
import { getAuth, signOut } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH} from '@fortawesome/free-solid-svg-icons'

const Logout = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);

         
    const logout = async () => {
       
    
        const auth = getAuth();
        console.log(auth);
        try {
            await signOut(auth);
            //signed out
        }
        catch(error) {
        // An error happened.
        };

       
}

    const showDropdown = (e) => {
      
        e.stopPropagation();
        setDropdownStatus(true);
        
}
   
    
    window.onclick = function (e) {
if (!e.target.matches('.dropdown') && !e.target.matches('.dropbtn')) {
    setDropdownStatus(false);
}
};





    
    
    const Dropdown = () => {
        if (dropdownStatus === true) {
            return (
                 <div id="myDropdown" className="dropdown-content">
                        <button onClick={logout}>Log out</button>
                      
                    </div>

            )
        }
        else return null;
    }


    return (
        <div>
    
            <div  className="dropdown">
                <FontAwesomeIcon
                    onClick={showDropdown} className="dropbtn" icon={faEllipsisH} />
                <Dropdown />
                  
                </div>
            
         
       
           
        </div>
    )
}

export default Logout;