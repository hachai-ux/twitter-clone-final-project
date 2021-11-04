import { useEffect, useState, useCallback } from "react";
import UserStatuses from '../components/UserStatuses';
import { useParams } from 'react-router-dom'
import ProfileStatuses from '../components/ProfileStatuses';


const Profile = (props) => {

    const { profilename } = useParams();



    const [statusSubmitted, setStatusSubmitted] = useState(null);

    const changeStatusSubmitted = useCallback((bool) => {
        setStatusSubmitted(bool);
    }, []);
    



    let profileSelection;
    if (props.user && (props.user.emailVerified === true) && profilename === props.username) {      
             profileSelection =   <UserStatuses db={props.db} user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
    }
    else if (profilename) {
        profileSelection = <ProfileStatuses db={props.db} profilename={profilename} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
    }

    

  



    return (
        <div className="homepage">
            <h1>Home</h1>
            {profileSelection}
            
        </div>
        
    );
};

export default Profile;