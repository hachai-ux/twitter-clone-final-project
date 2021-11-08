import { useState, useEffect, memo, useContext } from 'react';
import { deleteDoc, query, collection, getDocs } from "firebase/firestore";
import { UserContext } from '../context/Context';
import { Link } from 'react-router-dom';


const Status = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);

    const statusPath = `/${props.profilename}/status/${props.doc.id}`;
    console.log(statusPath);

    //context redundant
    const contextValue = useContext(UserContext);
    const { userState } = contextValue;

  
         
    const deleteStatus = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(props.doc.ref);
      
        //delete on docRef not doc
        await deleteDoc(props.doc.ref);
       
}


    const showDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
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
                        <button onClick={(e)=>deleteStatus(e)}>Delete</button>
                      
                    </div>

            )
        }
        else return null;
    }

  
   //don't show dropdown if it's not user
    let dropdown;
 
    if (props.isUser === false) {
        console.log('hi');
        dropdown = null;
    }
    else {
        console.log('hi');
        dropdown = <div className="dropdown">
            <button onClick={(e) => showDropdown(e)} className="dropbtn">...</button>
            <Dropdown />
        </div>
    }

    return (

        <Link to = {statusPath} >
            <div>
            <div>@{props.doc.data().username}</div>
            <div>{props.doc.data().status}</div>
            <div>{props.doc.data().timestamp.toDate().toString()}</div>
            {dropdown}
        </div>
        </Link>
        
    )
}

export default memo(Status);