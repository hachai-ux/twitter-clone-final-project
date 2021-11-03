import { useState, useEffect, memo, useContext } from 'react';
import { deleteDoc, query, collection, getDocs } from "firebase/firestore";
import { UserContext } from '../context/Context';
import { getAuth } from "firebase/auth";


const Status = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);
    const [username, setUsername] = useState('');

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

    useEffect(() => {

          
        const getUsername = async () => {

            const auth = getAuth();
            const user = auth.currentUser;
            const q = query(collection(props.db, "Users"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                    

                //loop through documents and get username for the uid
                if (doc.data().uid === user.uid) {
                    
                    setUsername(doc.id);
                }
            });

        
        };
        getUsername();
        
    },[])
  
    



    
    
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
            <div>@{username}</div>
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