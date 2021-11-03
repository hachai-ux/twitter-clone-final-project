import { useEffect, useState, memo } from 'react';
import { collection, query, getDocs, where, orderBy, onSnapshot } from 'firebase/firestore';
import Status from './Status.js';
import { nanoid } from 'nanoid';

const UserStatuses = (props) => {

    const [querySnapshot, setQuerySnapshot] = useState(null);
    //components should not be stored in state


    useEffect(() => {

        
        const getStatuses = async () => {
            
            const q = query(collection(props.db, "Tweets", props.user.uid, "Statuses"), where("name", "==", props.user.uid), orderBy("timestamp", 'desc'));
            
            setQuerySnapshot(await getDocs(q));
         

            //Start listening to the query.
            //Use listener instead of having to run query again in useEffect
            onSnapshot(q, function (snapshot) {
                const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
                if (source === 'Server') {
        
                setQuerySnapshot(snapshot);
                 
                }
               
                
                
                
            });
  
            

        };
        
        getStatuses();
        
        return () => { };
   
        
    }, []);

    let statuses;
    if (querySnapshot) {
        statuses = querySnapshot.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            return <li key={nanoid()}><Status db={props.db} doc={doc} /></li>
                
        });
    }
    else return null;
       
  


    return (
        <div>
            <ul>{statuses}</ul>
      </div>
        
    )

}



export default memo(UserStatuses);