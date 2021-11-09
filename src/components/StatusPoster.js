import { useState } from 'react';
import { collection, serverTimestamp, addDoc, updateDoc} from 'firebase/firestore';

const StatusPoster = (props) => {

    const [status, setStatus] = useState('');


    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
    }


    const handleSubmit = async (e) => {
       

        e.preventDefault();

        try {
        
            const docRef = await addDoc(collection(props.db, "Tweets", props.user.uid, "Statuses"), {
                name: props.user.uid,
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
      <form onSubmit={(e) => { handleSubmit(e) }}>
            <label htmlFor='status'>
             <textarea placeholder="What's happening?" value={status}  onChange={(e) => { handleChangeStatus(e)}} />
            </label>
        <input type="submit" value="Tweet" />
        </form>
        
    )

}



export default StatusPoster;