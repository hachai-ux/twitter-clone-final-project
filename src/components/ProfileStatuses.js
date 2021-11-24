import { useEffect, useState, memo } from 'react';
import { collection, query, getDocs, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Status from './Status.js';
import { nanoid } from 'nanoid';


const ProfileStatuses = (props) => {

    const [querySnapshot, setQuerySnapshot] = useState(null);
    //components should not be stored in state


    useEffect(() => {

        
        const getStatuses = async () => {

           

                  const q = query(collection(props.db, "Tweets", props.profileSnap.data().uid, "Statuses"), where("uid", "==", props.profileSnap.data().uid), orderBy("timestamp", 'desc'));
            
            setQuerySnapshot(await getDocs(q));
         

            //Start listening to the query.
            //Use listener instead of having to run query again in useEffect
            onSnapshot(q,{ includeMetadataChanges: true }, function (snapshot) {
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
            console.log(props.username);
            return <li key={nanoid()}><Status username={props.username} user={props.user}  profilename={props.profilename} db={props.db} doc={doc} /></li>
                
        });
    }
    else return null;
       
  


    return (
        <div>
            <ul>{statuses}</ul>
        
            
      </div>
        
    )

}



export default memo(ProfileStatuses);