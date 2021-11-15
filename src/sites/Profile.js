import { useEffect, useState, useCallback } from "react";
import UserStatuses from '../components/UserStatuses';
import { useParams } from 'react-router-dom'
import ProfileStatuses from '../components/ProfileStatuses';
import Follow from '../components/Follow';
import { doc, getDoc } from 'firebase/firestore';


const Profile = (props) => {

    const { profilename } = useParams();

    const [statusSubmitted, setStatusSubmitted] = useState(null);
    const [profileExists, setProfileExists] = useState(false);
     const [uid, setUid] = useState(null);

    const changeStatusSubmitted = useCallback((bool) => {
        setStatusSubmitted(bool);
    }, []);
    
    useEffect(() => {
        const checkProfileExists = async () => {
           const docRef = doc(props.db, "Users", profilename);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setUid(docSnap.data().uid);
                setProfileExists(true);

            }
        }
        checkProfileExists();
  })

    let statusSelection;
    if (props.user && (props.user.emailVerified === true) && profilename === props.username) {      
        statusSelection = <UserStatuses db={props.db} username={props.username}  user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
    }
    else if (profilename && profileExists === true) {
        console.log(props.user);
        statusSelection = <ProfileStatuses db={props.db} uid={uid} username={props.username} profilename={profilename} user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
    }

    
    let showFollow;
    if (props.user && (props.user.emailVerified === true) && profilename === props.username) {
        showFollow = null;
    }
    else if (profilename && profileExists === true && props.user) {
        showFollow = <Follow db={props.db} uid={uid} profilename={profilename} username={props.username} user= {props.user} />
    }



    return (
        <div className="homepage">
            <h1>{profilename}</h1>
            {showFollow}
            {statusSelection}
            
        </div>
        
    );
};

export default Profile; 