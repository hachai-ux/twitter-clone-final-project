import { useEffect, useState, memo } from 'react';
import { collection, query, getDocs, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Status from './Status.js';
import { nanoid } from 'nanoid';


const ReplyStatuses = (props) => {

    const [querySnapshot, setQuerySnapshot] = useState(null);
    //components should not be stored in state


    useEffect(() => {

        //get all replies to a status(= all documents of it's subcollection)
        
        const getStatuses = async () => {

            console.log(props.statusDoc);
            if (props.statusDoc) {
                const newCollectionRef = collection(props.db, `${props.statusDoc.ref.path}/Replies`);
            const q = query(newCollectionRef, orderBy("timestamp", 'asc'));
            
                
                
            setQuerySnapshot(await getDocs(q));
         

            //Start listening to the query.
            //Use listener instead of having to run query again in useEffect
            onSnapshot(q, { includeMetadataChanges: true }, function (snapshot) {
                const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
                if (source === 'Server') {
        
                setQuerySnapshot(snapshot);
                 
                }
               
                
        
            });
  
            }

            
            
            

        };
        
        getStatuses();
        
        return () => { };
   
        
    }, [props.statusDoc]);


    let statuses;
    if (querySnapshot) {
        statuses = querySnapshot.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots

            console.log(doc.id, " => ", doc.data());
            return <li key={nanoid()}><Status isUser={true} username={props.username} user={props.user} profilename={props.profilename} db={props.db} doc={doc} /></li>
                
        });
    }
    else return null;
       
  


    return (
        <div>
            <ul>{statuses}</ul>
        
            
      </div>
        
    )

}



export default memo(ReplyStatuses);