import { useState, useEffect, memo, useContext } from 'react';
import { deleteDoc, query, collection, getDocs } from "firebase/firestore";
import { UserContext } from '../context/Context';
import { Link } from 'react-router-dom';


const StatusNonClick = (props) => {

  
    

    //context redundant
     const contextValue = useContext(UserContext);
    const { userState } = contextValue;

    console.log(userState);
         
    const deleteStatus = async () => {
        console.log(props.doc.ref);
      
        //delete on docRef not doc
        await deleteDoc(props.doc.ref);
       
}

    


    let showStatus;
    if (props.doc) {
        console.log(props.doc);
        showStatus = <div>
            <div>@{props.profilename}</div>
            <div>{props.doc.data().status}</div>
            <div>{props.doc.data().timestamp.toDate().toString()}</div>
            <div className="dropdown">
               
                  
            </div>
        </div>
   
    }
    else showStatus = null;

    return (

        <div>
            { showStatus}
           </div>
       
        
    )
}

export default memo(StatusNonClick);