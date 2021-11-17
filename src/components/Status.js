import { useState, useEffect, memo, useContext } from 'react';
import { query, collectionGroup, where, getDocs, doc, onSnapshot, deleteDoc, collection, runTransaction, updateDoc, serverTimestamp} from "firebase/firestore";
import { UserContext } from '../context/Context';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';



const Status = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);
    const [originalDoc, setOriginalDoc] = useState(null);
    const [isRetweet, setIsRetweet] = useState(false);



    const statusPath = `/${props.doc.data().username}/status/${props.doc.id}`;
    console.log(statusPath);
    console.log(props.doc.ref.path);

    //context redundant
    const contextValue = useContext(UserContext);
    const { userState } = contextValue;


    useEffect(() => {

        const getRetweet = async () => {
            console.log(props.doc.data().retweet);
            if (props.doc.data().retweet === true) {
                        const q = query(collectionGroup(props.db, "Statuses"), where('docId', "==", props.doc.data().originalId));
                        
                console.log(await getDocs(q));
                const retweetDoc = await getDocs(q);
                retweetDoc.docs.forEach((doc) => {
                    setOriginalDoc(doc);
                });
                setIsRetweet(true);

                
            
                
            }
            
            
        }
       
        getRetweet();
        return () => { };
    },[])
  
         
    const deleteStatus = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(props.doc.ref);

        //if count is 0, then delete completely
        console.log(props.doc.ref.parent.parent.parent.id );
        if (props.doc.data().count === 0 && props.doc.ref.parent.parent.parent.id !== 'Tweets') {
            try {
                await runTransaction(props.db, async (transaction) => {
                    const parentDoc = await transaction.get(props.doc.ref.parent.parent);
                    console.log(parentDoc)
                    const newCount = parentDoc.data().count - 1;
                    
                    transaction.update(parentDoc.ref, {
                        count: newCount
                    });
                    transaction.delete(props.doc.ref);
                    
                
                })
            }
            catch (error){
                 console.error('Transaction failed', error);
            }
           

        }
        //if count is 1 or more(has replies) then show "This Tweet was deleted" in status
        //just update status
        else if (props.doc.data().count > 0) {
            await updateDoc(props.doc.ref, {
                status: "This Tweet was deleted.",
                deleted: true,
            });
           
        }
        //will run snapshot listener in parent component because status changed
        
        
       
    }


    const showDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownStatus(true);
    }


    const retweet = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try{
            await runTransaction(props.db, async (transaction) => {
                
                //there needs to be a difference between current user id and original tweet user id
                //check if user is logged in with props.user
                console.log(props.user);
                if (isRetweet === false && props.user) {
                    //get retweets of current doc
                console.log(props.user);
                const retweetUserDocRef = doc(props.db, `${props.doc.ref.path}/Retweets/${props.user.uid}`);
                const retweetUserDoc = await transaction.get(retweetUserDocRef);
                
                
                console.log(retweetUserDoc.exists());

                //add retweeter to status and add retweet to user tweets
                if (retweetUserDoc.exists() === false) {
                    
                    const newCollection = collection(props.db, 'Tweets', props.user.uid, 'Statuses')
                    //auto-generated id
                const retweetDocRef = doc(newCollection);
                    
                    console.log(retweetDocRef.id);
    
                    //set new status as retweet
                    //pointer doc
                    await transaction.set(retweetDocRef, {
                        docId: retweetDocRef.id,
                        originalId: props.doc.id,
                        retweet: true,
                        timestamp: serverTimestamp()

                    });
                    //add retweet info to original tweet
                    console.log(props.username);
                    await transaction.set(retweetUserDocRef, {
                        user: props.username,
                        userId: props.user.uid,
                        retweetId: retweetDocRef.id
                        
                    });
                   
                }
                else if (retweetUserDoc.exists() === true) {
                    //delete retweet docs if clicked on retweet again

                    //get retweet doc by id
                     console.log(retweetUserDoc);
                    console.log(retweetUserDoc.data().retweetId);
                    const retweetDocRef = doc(props.db, 'Tweets', props.user.uid, 'Statuses', retweetUserDoc.data().retweetId);
                    transaction.delete(retweetDocRef);
                    transaction.delete(retweetUserDocRef);
        
                }
           
                }
                else if (isRetweet === true && props.user) {
                    //query original doc with origialId
                    const retweetUserDocRef = doc(props.db, `${originalDoc.ref.path}/Retweets/${props.user.uid}`);
                    //delete doc pointer
                    transaction.delete(props.doc.ref);
                    //delete retweet information of original doc
                    transaction.delete(retweetUserDocRef);
                
                }
                
            });
        }
        catch (error) {
            console.error('Failed transaction', error);
        }
       
       
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
                    <button onClick={(e) => deleteStatus(e)}>Delete</button>

                </div>

            )
        }
        else return null;
    }

  
    //don't show dropdown if it's not user
    let dropdown;
 
    if (props.isUser === false) {
        console.log('hi');
        dropdown = null;
    }
    else {
        console.log('hi');
        dropdown = <div className="dropdown">
            <button onClick={(e) => showDropdown(e)} className="dropbtn">...</button>
            <Dropdown />
        </div>
    }


  

    let replies;
    if (props.doc.data().count === 0) {
        replies = null;
    }
    else if (props.doc.data().count === 1) {
        replies = <div>{props.doc.data().count} reply</div>
    }
    else if(props.doc.data().count){
        replies = <div>{props.doc.data().count} replies</div>
    }

    //check if status exists or was deleted
    let statusContainer;
    if (!props.doc.data().deleted) {
        statusContainer = <div>
            <div>@{props.doc.data().username}</div>
            <div>{props.doc.data().status}</div>
                <div>{props.doc.data().timestamp.toDate().toString()}</div>
            <button onClick={(e) => retweet(e)}>Retweet</button>
            {dropdown}
             </div>
    }
    else if (props.doc.data().deleted === true) {
        statusContainer = <div>
            <div>@{props.doc.data().username}</div>
            <div>{props.doc.data().status}</div>
                <div>{props.doc.data().timestamp.toDate().toString()}</div>
             </div>
    }


    let retweetContainer;
    
    if (originalDoc) {
        retweetContainer = <div>
            <div>@{originalDoc.data().username}</div>
            <div>{originalDoc.data().status}</div>
                <div>{originalDoc.data().timestamp.toDate().toString()}</div>
            <button onClick={(e) => retweet(e)}>Retweet</button>
             </div>
         
        
    }

    
    let statusType;
    if (!props.doc.data().retweet) {
        statusType = <div>
            {statusContainer}
            {replies}
        </div>
    }
    else if (props.doc.data().retweet === true) {
        statusType = <div>
            You retweeted
             {retweetContainer}
        </div>
    }

    return (

        <Link to = {statusPath} >
            <div>
            {statusType}
            </div>
        </Link>
        
    )
}

export default memo(Status);