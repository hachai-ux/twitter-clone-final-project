import StatusNonClick from '../components/StatusNonClick';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collectionGroup, query, getDocs, where, collection} from 'firebase/firestore';

const StatusPage = (props) => {
    
    //component shouldn't rely on props from link in case of direct access
    
    const { statusid } = useParams();
    const [statusDoc, setStatusDoc] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {

        const getDocument = async () => {
            const q = query(collectionGroup(props.db, 'Statuses'), where('docId', '==', statusid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((d) => {
                console.log(d);
                setStatusDoc(d);
            });
            
            
          
            
            
        }
       
        getDocument();

    }, []);


    useEffect(() => {

        const getUsername = async () => {
           

            //get username from user
            const q = query(collection(props.db, "Users"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                    
                console.log(doc.data().name);
                console.log(statusDoc);
                console.log(statusDoc.id);

                //loop through documents and get username for the uid
                if (doc.data().name === statusDoc.docId) {
                    
                    setUsername(doc.id);
                    console.log(doc.id);
                }
            });
            
            
            
        }
       
        getUsername();

    }, [statusDoc]);

    console.log(statusDoc)

    return (
        <StatusNonClick profilename={username} db={props.db} doc={statusDoc} />
    )
}

export default StatusPage;