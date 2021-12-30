import { useState, useEffect, memo, useContext } from 'react';
import { query, collectionGroup, where, getDocs, doc, onSnapshot, deleteDoc, collection, runTransaction, updateDoc, serverTimestamp} from "firebase/firestore";
import { UserContext } from '../context/Context';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faRetweet, faUserCircle } from '@fortawesome/free-solid-svg-icons';




const Status = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);
    const [originalDoc, setOriginalDoc] = useState(null);
    const [isRetweet, setIsRetweet] = useState(false);
    const [statusPath, setStatusPath] = useState(`/${props.doc.data().username}/status/${props.doc.id}`);
   


  

    //context redundant
    const contextValue = useContext(UserContext);
    const { userState } = contextValue;

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


    useEffect(() => {

        const getRetweet = async () => {

            if (props.doc.data().retweet === true) {
                        const q = query(collectionGroup(props.db, "Statuses"), where('docId', "==", props.doc.data().originalId));
            
                const retweetDoc = await getDocs(q);
                retweetDoc.docs.forEach((doc) => {
                    setOriginalDoc(doc);
                        setStatusPath(`/${doc.data().username}/status/${doc.id}`);
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
    


        //if count is 0, then delete completely
     
        if (props.doc.data().count === 0 && props.doc.ref.parent.parent.parent.id !== 'Tweets') {
            try {
                console.log('delete 2')
                await runTransaction(props.db, async (transaction) => {
                    const parentDoc = await transaction.get(props.doc.ref.parent.parent);
              
                    const newCount = parentDoc.data().count - 1;
                    
                    transaction.update(parentDoc.ref, {
                        count: newCount
                    });
                    console.log(props.doc.ref);
                    transaction.delete(props.doc.ref);
                    
                
                })
            }
            catch (error){
                 console.error('Transaction failed', error);
            }
           

        }
        else if (props.doc.data().count === 0) {
            await deleteDoc(props.doc.ref);
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
            const retweetStatusTr = await runTransaction(props.db, async (transaction) => {
                
                //there needs to be a difference between current user id and original tweet user id
                //check if user is logged in with props.user
         
                if (isRetweet === false && props.user) {
                    //get retweets of current doc
         
                const retweetUserDocRef = doc(props.db, `${props.doc.ref.path}/Retweets/${props.user.uid}`);
                const retweetUserDoc = await transaction.get(retweetUserDocRef);
                
                
             

                //add retweeter to status and add retweet to user tweets
                if (retweetUserDoc.exists() === false) {
                    
                    const newCollection = collection(props.db, 'Tweets', props.user.uid, 'Statuses')
                    //auto-generated id
                const retweetDocRef = doc(newCollection);
                    
             
    
                    //set new status as retweet
                    //pointer doc
                    await transaction.set(retweetDocRef, {
                        docId: retweetDocRef.id,
                        originalId: props.doc.id,
                        retweet: true,
                        timestamp: serverTimestamp(),
                        uid: props.user.uid

                    });
                    //add retweet info to original tweet
 
                    await transaction.set(retweetUserDocRef, {
                        user: props.username,
                        userId: props.user.uid,
                        retweetId: retweetDocRef.id
                        
                    });

                    return true;
                   
                }
                else if (retweetUserDoc.exists() === true) {
                    //delete retweet docs if clicked on retweet again

                    //get retweet doc by id
            
                    const retweetDocRef = doc(props.db, 'Tweets', props.user.uid, 'Statuses', retweetUserDoc.data().retweetId);
                    transaction.delete(retweetDocRef);
                    transaction.delete(retweetUserDocRef);
        
                    return false;
                }
           
                }
                else if (isRetweet === true && props.user) {
                    //query original doc with origialId
                    const retweetUserDocRef = doc(props.db, `${originalDoc.ref.path}/Retweets/${props.user.uid}`);
                    //delete doc pointer
                    transaction.delete(props.doc.ref);
                    //delete retweet information of original doc
                    transaction.delete(retweetUserDocRef);
                    
                    return false;
                
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
 
    if (props.username !== props.profilename) {

        dropdown = null;
    }
    else {
  
        dropdown = <div className="dropdown">
             <FontAwesomeIcon
                    onClick={(e)=>showDropdown(e)} className="dropbtn" icon={faEllipsisH} size="xs" />
          
            <Dropdown />
        </div>
    }


  

    let replies;
    if (props.doc.data().count === 0) {
        replies = null;
    }
    else if (props.doc.data().count === 1) {
        replies = <div className="replies">{props.doc.data().count} reply</div>
    }
    else if(props.doc.data().count){
        replies = <div className="replies">{props.doc.data().count} replies</div>
    }

    //check if status exists or was deleted
    const usernamePath = `/${props.username}`;
    let statusContainer;
    if (!props.doc.data().deleted) {
        statusContainer = <div className="status-container">
        
          <div className="profile-icon"><FontAwesomeIcon icon={faUserCircle} size="2x" /></div>
              
            <div className="status-content">
                <div className="status-header">
                    <h5><Link to={usernamePath}>{props.doc.data().username}</Link></h5>
                  
                        <div className="status-time">{formatDate(props.doc.data().timestamp.toDate())}</div>
                 {dropdown}
                </div>
                
                <div className="status">{props.doc.data().status}</div>
            
                <div className="retweet-icon"><FontAwesomeIcon onClick={(e) => retweet(e)} icon={faRetweet} size="sm" /></div>
       
             {replies}
            </div>
            </div>
            
             
    }
    else if (props.doc.data().deleted === true) {
        statusContainer = <div className="status-container">
            
             <div className="profile-icon"><FontAwesomeIcon icon={faUserCircle} size="2x" /></div>
              
            <div className="status-content">
                <div className="status-header">
                    <h5><Link to={usernamePath}>{props.doc.data().username}</Link></h5></div>
                 <div className="status-time">{formatDate(props.doc.data().timestamp.toDate())}</div>
            <div className="status">{props.doc.data().status}</div>
                
            </div>
           
             </div>
    }


    let retweetContainer;

   
    
    if (originalDoc) {
        retweetContainer = <div className="status-container">
            
               <div className="profile-icon"><FontAwesomeIcon icon={faUserCircle} size="2x" /></div>
            
            <div className="status-content">
                <div className="status-header">
                    <h5><Link to={usernamePath}>@{originalDoc.data().username}</Link></h5>
                     <div className="status-time">{formatDate(originalDoc.data().timestamp.toDate())}</div>
                    </div>
            <div className="status">{originalDoc.data().status}</div>
                
                 <div className="retweet-icon"><FontAwesomeIcon onClick={(e) => retweet(e)} icon={faRetweet} size="sm" /></div>
          
            </div>
            </div>
         
        
    }

    
    let statusType;
    if (!props.doc.data().retweet) {
        statusType = <div>
            {statusContainer}
           
        </div>
    }
    else if (props.doc.data().retweet === true) {
        statusType = <div className="retweet-container">
            <div className="retweet-header"><FontAwesomeIcon className="you-retweeted" icon={faRetweet} size="xs" />
                <p>You retweeted</p>
                </div>
             {retweetContainer}
        </div>
    }

    return (

        <Link to = {statusPath} style={{ textDecoration: 'none' }}>
            <div>
            {statusType}
            </div>
        </Link>
        
    )
}

export default memo(Status);