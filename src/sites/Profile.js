import { useEffect, useState, useCallback } from "react";
import UserStatuses from '../components/UserStatuses';
import { useParams } from 'react-router-dom'
import ProfileStatuses from '../components/ProfileStatuses';
import Follow from '../components/Follow';
import { doc, getDoc } from 'firebase/firestore';
import ProfileSuggestions from '../components/ProfileSuggestions';


const Profile = (props) => {

    const { profilename } = useParams();

    const [statusSubmitted, setStatusSubmitted] = useState(null);
    const [profileSnap, setProfileSnap] = useState(null);

    const changeStatusSubmitted = useCallback((bool) => {
        setStatusSubmitted(bool);
    }, []);
    
    useEffect(() => {
        const checkProfileExists = async () => {
           const docRef = doc(props.db, "Users", profilename);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
              
                setProfileSnap(docSnap);
                

            }
        }
        checkProfileExists();
  },[])

    let statusSelection;
    console.log(profileSnap); 
    if (profileSnap !== null) {
        if (props.user  && (profilename === props.username)) {
            statusSelection = <UserStatuses db={props.db} username={props.username} user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
        }
        else if (profilename && profileSnap.exists()) {
            console.log(props.user);
            statusSelection = <ProfileStatuses db={props.db} profileSnap={profileSnap} username={props.username} profilename={profilename} user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
        }
    }

    
    let showFollow;
    if (profileSnap !== null) {

         if (props.user  && profilename === props.username) {
        showFollow = null;
    }
         else if (profilename && profileSnap.exists() && props.user) {
             console.log(props.username);
        showFollow = <Follow db={props.db} profileSnap = {profileSnap} profilename={profilename} username={props.username} user= {props.user} />
    };

        
    }
   


    return (
        <div className="profile-content">
            <div className="profile-main">
                <div className="profile-header">
                    <h2>{profilename}</h2>
                    <div className="profile-follow">{showFollow}</div>
                </div>
                {statusSelection}
            </div>
            <div className="profile-sidebar">
                       <ProfileSuggestions db={props.db} username={props.username} user={props.user} />
            </div>
           
            
        </div>
        
    );
};

export default Profile; 