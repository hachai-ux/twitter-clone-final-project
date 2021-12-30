import { useState, useEffect, memo, useContext } from 'react';
import { deleteDoc, query, collection, getDocs } from "firebase/firestore";
import { UserContext } from '../context/Context';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';


const StatusNonClick = (props) => {

  
      function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

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
        showStatus = <div className="non-click-status">
            <div className="status-top">
                 <div className="profile-icon"><FontAwesomeIcon icon={faUserCircle} size="2x" /></div>
                <h5>{props.doc.data().username}</h5>
                <div className="status-time">{formatDate(props.doc.data().timestamp.toDate())}</div>
            </div>
            <div className="status">{props.doc.data().status}</div>
           
           
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