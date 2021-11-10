import StatusNonClick from '../components/StatusNonClick';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collectionGroup, query, getDocs, where, collection } from 'firebase/firestore';
import ReplyPoster from '../components/ReplyPoster';
import ReplyStatuses from '../components/ReplyStatuses';

const StatusPage = (props) => {
    
    //component shouldn't rely on props from link in case of direct access
    
    const { statusid } = useParams();
    const [statusDoc, setStatusDoc] = useState('');
    const [username, setUsername] = useState('');

    console.log(statusid);

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

    }, [statusid]);


   

    console.log(statusDoc)

    return (
        <div>
            <StatusNonClick profilename={props.username} db={props.db} doc={statusDoc} />
            <ReplyPoster statusDoc={statusDoc} username={props.username} user={props.user} db={props.db} />
            <ReplyStatuses statusDoc={statusDoc} db={props.db} />
        </div>
    )
}

export default StatusPage;