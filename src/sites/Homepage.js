import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useCallback } from "react";
import StatusPoster from '../components/StatusPoster';
import UserStatuses from '../components/UserStatuses';
import { useParams } from 'react-router-dom';

const Homepage = (props) => {

    const { profilename } = useParams();
    const [statusSubmitted, setStatusSubmitted] = useState(null);

    const changeStatusSubmitted = useCallback((bool) => {
        setStatusSubmitted(bool);
    },[]);

    

    
    const LoggedIn = () => {

        if (props.user && (props.user.emailVerified === true)) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
          


            return (
                
                <div>
                    <StatusPoster db={props.db} username={props.username} user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted}/>
                    <UserStatuses db={props.db} username={props.username}  user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted}/>
                </div>
            )
            // ...
        } else {
            // User is signed out
            // ...
            return null;
        }

    }


    return (
        <div className="homepage">
            <h1>Home</h1>
            <LoggedIn />
            
        </div>
        
    );
};

export default Homepage;