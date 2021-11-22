import { useEffect, useRef, useState, memo } from 'react';
import { collection, collectionGroup, query, getDocs, where, orderBy, onSnapshot, onSnapshotsInSync } from 'firebase/firestore';
import Status from './Status.js';
import { nanoid } from 'nanoid';

const UserStatuses = (props) => {

    const [statusSnapshots, setStatusSnapshots] = useState([]);
    const [feedData, setFeedData] = useState([]);
    const uids = useRef([]);
 
                

    useEffect(() => {

 
        //old
        /*
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

     */
        
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

                uids.current = uids.current.concat(props.user.uid);
                 console.log(uids.current);
                const qFollowing = query(collection(props.db, "Users", props.username, "Following"));
                const qFollowingSnapshot = await getDocs(qFollowing);
                console.log(qFollowingSnapshot)
                qFollowingSnapshot.docs.forEach((doc) => {
                    
                    console.log(uids.current);
                    //check if already exists in uids ref
                    if (uids.current.indexOf(doc.data().uid) === -1) {
                         uids.current = uids.current.concat(doc.data().uid);
                    }
                      console.log(uids.current);
                   
                    
                    //const q = query(collection(props.db, "Tweets", uid, "Statuses"), orderBy("timestamp", 'desc'));
                }
                )
            };
        }
          
                
        const getFeed = async () => {
            
            if (props.username !== null) {
               
                 //get feed of all followed ids
                
            while (uids.current.length) {
                //firestore limits batches to 10
                //removes elements from uids and assigns it to batch
                const batch = uids.current.splice(0, 10);
                
                const q = query(collectionGroup(props.db, 'Statuses'), where('uid', 'in', [...batch]))

                console.log(batch);
                //redundant
                /*
                const qSnapshot = await getDocs(q);
                console.log(qSnapshot);
                const qSnapshotArray = qSnapshot.docs.map((doc) => {
                    return doc;
                });
                batches.push(...qSnapshotArray)
                console.log(qSnapshotArray);
                */

                //Start listening to the query.
                //Use listener instead of having to run query again in useEffect
                //Activated when metadata changes from local to server and the source is server
                // eslint-disable-next-line no-loop-func
               
            
                //onSnapshot callback gets called once initially
                // eslint-disable-next-line no-loop-func
                const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, function (snapshot) {
                    console.log('on snapshot');
                    const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log(source);
                    
                    if (source === 'Server') {
                        console.log('on snapshot 2');
                        console.log(snapshot);
                        //can't figure out bug, why docChanges doesn't recognize when document is added to database
                        console.log(snapshot.docChanges());
                        
                        if (snapshot.docChanges().length === 0) {
                            //filter for the doc that doesn't exist
                            const addedDoc = snapshot.docs.filter((snapshotDoc) => !sortedBatches.some((sortedBatchDoc) => snapshotDoc.data().docId === sortedBatchDoc.data().docId));
                            //add it to sortedBatches
                            console.log(addedDoc);
                            sortedBatches = sortedBatches.concat(addedDoc);
                            const newSortedFeedData = sortedBatches.sort((a, b) => b.data().timestamp - a.data().timestamp)
                            console.log('docchanges is empty')
                            
                            setFeedData(newSortedFeedData);
                        }
                        
                        snapshot.docChanges().forEach((change) => {
                            console.log(change);
                            if (change.type === "added") {
                                console.log('on snapshot 3');
                                //sortedBatches unsafe reference to variable, but works here    
                              
                                sortedBatches = sortedBatches.concat(change.doc);
                                
                              
                                const newSortedFeedData = sortedBatches.sort((a, b) => b.data().timestamp - a.data().timestamp)
                              
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
            
            
        
    
        
        //both need to run one after another not concurrently
        (async () => {
            await getFollowedIds();
            await getFeed();
        })();
        

   
        
        return () => { };
        
    }, [props.username]);

    let statuses;
 
   
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