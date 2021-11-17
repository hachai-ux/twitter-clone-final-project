import { useEffect, useState, memo } from 'react';
import { collection, collectionGroup, query, getDocs, where, orderBy, onSnapshot } from 'firebase/firestore';
import Status from './Status.js';
import { nanoid } from 'nanoid';

const UserStatuses = (props) => {

    const [statusSnapshots, setStatusSnapshots] = useState([]);
    const [feedData, setFeedData] = useState([]);
    let uids = [props.user.uid];
 
                

    useEffect(() => {

 
        //old
        const getStatuses = async () => {
            
            const q = query(collection(props.db, "Tweets", props.user.uid, "Statuses"), orderBy("timestamp", 'desc'));
            
            //concat onto array
            const qSnapshot = await getDocs(q);
            const qSnapshotArray = qSnapshot.docs.map((doc) => {
                return doc;
            });

            //Start listening to the query.
            //Use listener instead of having to run query again in useEffect
            //Activated when metadata changes from local to server and the source is server
            onSnapshot(q, { includeMetadataChanges: true },function (snapshot) {
                const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
                console.log(source);
                if (source === 'Server') {
                    
                    setStatusSnapshots(snapshot);
                 
                }
                
                
            });

           


        };
        
        //getStatuses();

     
        
        return () => { };
   
        
    }, []);

    useEffect(() => {

        //can use helper to check if username is loaded

           let batches = [];
           let sortedBatches = [];

        console.log(props.username);

        const getFollowedIds = async () => {
            
            console.log(props.username);
            if (props.username !== null) {
                const qFollowing = query(collection(props.db, "Users", props.username, "Following"));
                const qFollowingSnapshot = await getDocs(qFollowing);
                qFollowingSnapshot.docs.forEach((doc) => {
                    uids.concat(doc.data().uid);
                    //const q = query(collection(props.db, "Tweets", uid, "Statuses"), orderBy("timestamp", 'desc'));
                }
                )
            };
        }
          
                
        const getFeed = async () => {
            
            if (props.username !== null) {
               
                 //get feed of all followed ids
                
            while (uids.length) {
                //firestore limits batches to 10
                //removes elements from uids and assigns it to batch
                const batch = uids.splice(0, 10)
                
                const q = query(collectionGroup(props.db, 'Statuses'), where('uid', 'in', [...batch]))
                const qSnapshot = await getDocs(q);
                console.log(qSnapshot);
                const qSnapshotArray = qSnapshot.docs.map((doc) => {
                    return doc;
                });
                batches.push(...qSnapshotArray)
                console.log(qSnapshotArray);

                //Start listening to the query.
                //Use listener instead of having to run query again in useEffect
                //Activated when metadata changes from local to server and the source is server
                // eslint-disable-next-line no-loop-func
               
            
                //onSnapshot callback gets called once initially
                // eslint-disable-next-line no-loop-func
                onSnapshot(q, { includeMetadataChanges: true }, function (snapshot) {
                    console.log('on snapshot');
                    const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log(source);
                    if (source === 'Server') {
                        console.log('on snapshot 2');
                        console.log(snapshot);
                        console.log(snapshot.docChanges());
                        snapshot.docChanges().forEach((change) => {
                            console.log(change);
                            if (change.type === "added") {
                                console.log('on snapshot 3');
                                //sortedBatches unsafe reference to variable, but works here    
                                //bug(?): why does index changes for add
                                sortedBatches = sortedBatches.concat(change.doc);
                                console.log(sortedBatches);
                              
                                const newSortedFeedData = sortedBatches.sort((a, b) => b.data().timestamp - a.data().timestamp)
                                console.log(newSortedFeedData);
                                setFeedData(newSortedFeedData);
                            }
                            //check if already exists
                            if (change.type === "removed") {
                                   console.log('on snapshot 4');
                                console.log("Removed city: ", change.doc.data());
 
                                //delete normal tweets or retweets
                                sortedBatches = sortedBatches.filter(doc => doc.data().docId !== change.doc.data().docId);
                                
                                setFeedData(sortedBatches);
                                    
                            };
                        
        
                    
                        });
                    }
                    
                    
                });
                
                
            }

            }
           
                };
            
            
        
    
        
         
        getFollowedIds();
        getFeed();

   
        
        return () => { };
        
    }, [props.username]);

    let statuses;
 
    console.log(feedData);
    if (feedData.length > 0) {
        statuses = feedData.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
           
            return <li key={nanoid()}><Status username={props.username} user={props.user} profilename={doc.data().username} db={props.db} doc={doc} /></li>
                
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