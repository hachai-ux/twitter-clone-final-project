import { useEffect, useState, memo } from 'react';
import { collection, query, getDocs, where, orderBy, onSnapshot } from 'firebase/firestore';
import Status from './Status.js';
import { nanoid } from 'nanoid';

const UserStatuses = (props) => {

    const [querySnapshot, setQuerySnapshot] = useState(null);
    const [followedUsers, setFollowedUsers] = useState(null);
    //components should not be stored in state


    useEffect(() => {

        
        const getStatuses = async () => {
            
            const q = query(collection(props.db, "Tweets", props.user.uid, "Statuses"), orderBy("timestamp", 'desc'));
            
            setQuerySnapshot(await getDocs(q));
            //Start listening to the query.
            //Use listener instead of having to run query again in useEffect
            //Activated when metadata changes from local to server and the source is server
            onSnapshot(q, { includeMetadataChanges: true },function (snapshot) {
                const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
                console.log(source);
                if (source === 'Server') {
                    
                    setQuerySnapshot(snapshot);
                 
                }
                
                
            });



        };
        
        getStatuses();
        
        return () => { };
   
        
    }, []);

    useEffect(() => {

        const getFollowedStatuses = async () => {
            
            console.log(props.username);
            if (props.username !== null) {
                 const qFollowing = query(collection(props.db, "Users", props.username, "Following"));
                const qFollowingSnapshot = await getDocs(qFollowing);
                console.log(qFollowingSnapshot)
            setFollowedUsers(qFollowingSnapshot.docs.map((doc) => {
                return doc.data().uid;
            }));

                
           }
          
                
            };

        
            //get "following" user list and run query for every followed profile

        
        getFollowedStatuses();

        console.log(followedUsers);
        
        return () => { };
        
    }, [props.username]);

    let statuses;
    if (querySnapshot) {
        statuses = querySnapshot.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
        
            console.log(doc.data());
            return <li key={nanoid()}><Status username={props.username} user={props.user} profilename={props.username} db={props.db} doc={doc} /></li>
                
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