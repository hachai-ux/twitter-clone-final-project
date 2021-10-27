import { useState } from 'react';
import { collection, serverTimestamp, addDoc} from 'firebase/firestore';

const StatusPoster = (props) => {

    const [status, setStatus] = useState('');


    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
    }


    const handleSubmit = async (e) => {
       

        e.preventDefault();

        try {
            /*
            const docRef = await props.db.collection('Tweets').doc(props.user.uid).collection('Statuses').add({
            name: props.user.uid,
            status: status,
            time: serverTimestamp(),
            });
            */
            
            const docRef = await addDoc(collection(props.db, "Tweets", props.user.uid, "Statuses"), {
                name: props.user.uid,
                            status: status,
                            time: serverTimestamp(),
                });
             
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