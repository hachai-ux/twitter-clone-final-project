import { useEffect, useState, useCallback } from "react";
import UserStatuses from '../components/UserStatuses';
import { useParams } from 'react-router-dom'
import ProfileStatuses from '../components/ProfileStatuses';
import Follow from '../components/Follow';


const Profile = (props) => {

    const { profilename } = useParams();



    const [statusSubmitted, setStatusSubmitted] = useState(null);

    const changeStatusSubmitted = useCallback((bool) => {
        setStatusSubmitted(bool);
    }, []);
    
    console.log(profilename);
console.log(props.username);

    let statusSelection;
    if (props.user && (props.user.emailVerified === true) && profilename === props.username) {      
        statusSelection = <UserStatuses db={props.db} username={props.username}  user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
    }
    else if (profilename) {
        console.log(props.user);
        statusSelection = <ProfileStatuses  db={props.db} username={props.username} profilename={profilename} user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
    }

    
    let showFollow;
    if (props.user && (props.user.emailVerified === true) && profilename === props.username) {
        showFollow = null;
    }
    else if (profilename && props.user) {
        showFollow = <Follow db={props.db} profilename={profilename} username={props.username} user= {props.user} />
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