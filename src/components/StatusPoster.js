import { useState } from 'react';
import { collection, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle} from '@fortawesome/free-solid-svg-icons';


const StatusPoster = (props) => {

    const [status, setStatus] = useState('');


    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
    }


    const handleSubmit = async (e) => {
       

        e.preventDefault();

        try {
        
            const docRef = await addDoc(collection(props.db, "Tweets", props.user.uid, "Statuses"), {
                uid: props.user.uid,
                status: status,
                username: props.username,
                timestamp: serverTimestamp(),
                count: 0
                            
                });
            
            await updateDoc(docRef, {
            docId: docRef.id
            });
             
            console.log(docRef);
            setStatus('');
            
         }
        
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }


       
    
    }




    return (
        <form className="status-poster-form" onSubmit={(e) => { handleSubmit(e) }}>
            <div className="status-poster-content">
                <div className="profile-icon"><FontAwesomeIcon icon={faUserCircle} size="2x" /></div>
              
            <label htmlFor='status'>
            </label>
             <textarea id="status" name="status" placeholder="What's happening?" value={status}  onChange={(e) => { handleChangeStatus(e)}} />
          

            </div>
           
        <input type="submit" value="Tweet" />
        </form>
        
    )

}



export default StatusPoster;