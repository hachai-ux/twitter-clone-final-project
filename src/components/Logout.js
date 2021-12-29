import { useState, useEffect} from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'


const Logout = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);

    const history = useHistory();
         
    const logout = async () => {
       
    
        const auth = getAuth();
       
        try {
            console.log(auth);
            await signOut(auth);
            
            //signed out
            console.log(auth.currentUser);
           
        }
        catch (error) {
            // An error happened.
        };

    
    }
    
    useEffect(() => {
        //change Routes ID when unmounts
        return () => {
          
            console.log("cleanup");
            props.changeRoutesId();
             history.push('/');
        }
    },[]);

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