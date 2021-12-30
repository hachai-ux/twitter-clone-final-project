import { useState } from 'react';
import { collection, serverTimestamp, doc, addDoc, updateDoc, runTransaction} from 'firebase/firestore';

const ReplyPoster = (props) => {

    const [status, setStatus] = useState('');


    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
    }


    const handleSubmit = async (e) => {
       

        e.preventDefault();



        try {
            //batch creating reply and updating count in a transaction to avoid discrepancies, in case one fails
            await runTransaction(props.db, async (transaction) => {
                
                //check if status doc was updated concurrently - transaction only success if it wasnt
                const statusDoc = await transaction.get(props.statusDoc.ref);

               
                const newCollectionRef = collection(props.db, `${props.statusDoc.ref.path}/Replies`);
              
                const docRef = doc(newCollectionRef);
                
                

                //create new reply
                await transaction.set(docRef, {
                    uid: props.user.uid,
                    status: status,
                    username: props.username,
                    timestamp: serverTimestamp(),
                    count: 0,
                    docId: docRef.id
                            
                });

                //calculate new count
                const newCount = statusDoc.data().count + 1;

                console.log(newCount);
            
                //update status doc
                transaction.update(statusDoc.ref, {
                    count: newCount
                });
             
                console.log(docRef);
                
            });
            
            setStatus('');
            
         }
        
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }


       
    
    }




    return (
      <form className="status-poster-form" onSubmit={(e) => { handleSubmit(e) }}>
            <label htmlFor='reply'></label>
             <textarea id="reply" name="reply" placeholder="Tweet your reply" value={status}  onChange={(e) => { handleChangeStatus(e)}} />
           
        <input type="submit" value="Reply" />
        </form>
        
    )

}



export default ReplyPoster;