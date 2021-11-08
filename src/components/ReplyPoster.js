import { useState } from 'react';
import { collection, serverTimestamp, addDoc, updateDoc} from 'firebase/firestore';

const ReplyPoster = (props) => {

    const [status, setStatus] = useState('');


    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
    }


    const handleSubmit = async (e) => {
       

        e.preventDefault();

        try {
            console.log(`${props.statusDoc.ref.path}/Statuses`);
            const newCollectionRef = collection(props.db, `${props.statusDoc.ref.path}/Statuses`);
            console.log(newCollectionRef);
            console.log(props.statusDoc.ref.path);
            
            const docRef = await addDoc(newCollectionRef, {
                name: props.user.uid,
                            status: status,
                timestamp: serverTimestamp(),
                            
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
             <textarea placeholder="Tweet your reply" value={status}  onChange={(e) => { handleChangeStatus(e)}} />
            </label>
        <input type="submit" value="Reply" />
        </form>
        
    )

}



export default ReplyPoster;