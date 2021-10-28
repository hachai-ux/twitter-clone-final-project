import { useEffect, useState } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import Status from './Status.js';
import { nanoid } from 'nanoid';


const UserStatuses = (props) => {

    const [statuses, setStatuses] = useState(null);



    useEffect(() => {

        
        const getStatuses = async () => {
            console.log('Hey');
            const q = query(collection(props.db, "Tweets",props.user.uid,"Statuses"), where("name", "==", props.user.uid), orderBy("timestamp", 'desc'));

            const querySnapshot = await getDocs(q);
            setStatuses(querySnapshot.docs.map((doc) => {
                // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                return <li key={nanoid()}><Status doc={doc} changeStatusSubmitted={props.changeStatusSubmitted}/></li>
                
            }));

            //rerender component when statusSubmitted is changed
            props.changeStatusSubmitted(false);
        };
        
            getStatuses();
          
        
},[props.statusSubmitted])

    
    
  


    return (
        <div>
            <ul>{statuses}</ul>
      </div>
        
    )

}



export default UserStatuses;