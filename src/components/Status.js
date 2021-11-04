import { useState, useEffect, memo, useContext } from 'react';
import { deleteDoc, query, collection, getDocs } from "firebase/firestore";
import { UserContext } from '../context/Context';


const Status = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);
    

    //context redundant
     const contextValue = useContext(UserContext);
    const { userState } = contextValue;

    console.log(userState);
         
    const deleteStatus = async () => {
        console.log(props.doc.ref);
      
        //delete on docRef not doc
        await deleteDoc(props.doc.ref);
       
}


const showDropdown = () => {
    setDropdownStatus(true);
}
   
    
    window.onclick = function (e) {
if (!e.target.matches('.dropbtn')) {
    setDropdownStatus(false);
}
};

    
    const Dropdown = () => {
        if (dropdownStatus === true) {
            return (
                 <div id="myDropdown" className="dropdown-content">
                        <button onClick={deleteStatus}>Delete</button>
                      
                    </div>

            )
        }
        else return null;
    }

    console.log(props.doc.data());

    return (
        <div>
            <div>@{props.profilename}</div>
            <div>{props.doc.data().status}</div>
            <div>{props.doc.data().timestamp.toDate().toString()}</div>
             <div className="dropdown">
                <button onClick={showDropdown} className="dropbtn">...</button>
                <Dropdown />
                  
                </div>
            
         
       
           
        </div>
    )
}

export default memo(Status);