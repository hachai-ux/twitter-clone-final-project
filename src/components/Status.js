import { useState, useEffect, memo, useContext } from 'react';
import { doc, deleteDoc, collection, runTransaction, updateDoc} from "firebase/firestore";
import { UserContext } from '../context/Context';
import { Link } from 'react-router-dom';


const Status = (props) => {

    const [dropdownStatus, setDropdownStatus] = useState(false);
    

    const statusPath = `/${props.doc.data().username}/status/${props.doc.id}`;
    console.log(statusPath);
    console.log(props.doc.ref.path);

    //context redundant
    const contextValue = useContext(UserContext);
    const { userState } = contextValue;

  
         
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
                
                console.log(props.user);
                const retweetUserDocRef = doc(props.db, `${props.doc.ref.path}/Retweets/${props.user.uid}`);
                const retweetUserDoc = await transaction.get(retweetUserDocRef);

                //add retweeter to status and add retweet to user tweets
                if (retweetUserDoc.exists() === false) {
                    const newCollection = collection(props.db, 'Tweets', props.user.uid, 'Statuses')
                    //auto-generated id
                    const retweetDocRef = doc(newCollection);
                    console.log(retweetDocRef.id);
                    console.log(props.doc.id);
                    //set new status as retweet
                    await transaction.set(retweetDocRef, {
                        docId: retweetDocRef.id,
                        originalId: props.doc.id,
                        retweet: true

                    });
                    //add retweet info to original tweet
                    await transaction.set(retweetUserDocRef, {
                        user: props.username,
                        userId: props.user.uid,
                        retweetId: retweetDocRef.id
                    });
                   
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

    return (

        <Link to = {statusPath} >
            <div>
                {statusContainer}
                {replies}
        </div>
        </Link>
        
    )
}

export default memo(Status);