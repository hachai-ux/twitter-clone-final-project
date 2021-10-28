import { useState, useEffect } from 'react';
import { deleteDoc } from "firebase/firestore";

const Status = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);

         
    const deleteStatus = async () => {
        console.log(props.doc.data());
        await deleteDoc(props.doc);
        //props.changeStatusSubimport { deleteDoc } from "firebase/firestore";mitted(true);
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

    return (
        <div>
            <div>{props.doc.data().name}</div>
            <div>{props.doc.data().status}</div>
            <div>{props.doc.data().timestamp.toDate().toString()}</div>
             <div className="dropdown">
                <button onClick={showDropdown} className="dropbtn">...</button>
                <Dropdown />
                  
                </div>
            
         
       
           
        </div>
    )
}

export default Status;