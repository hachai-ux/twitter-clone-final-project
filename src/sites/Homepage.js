import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useCallback } from "react";
import StatusPoster from '../components/StatusPoster';
import UserStatuses from '../components/UserStatuses';
import { useParams } from 'react-router-dom';
import ProfileSuggestions from '../components/ProfileSuggestions';

const Homepage = (props) => {

    const { profilename } = useParams();
    const [statusSubmitted, setStatusSubmitted] = useState(null);

    const changeStatusSubmitted = useCallback((bool) => {
        setStatusSubmitted(bool);
    },[]);

    

    
    const LoggedIn = () => {

        if (props.user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
          


            return (
                
                <div className="home-content">
                    <div className="home-main">
                        <div className="home-top-bar">
                            <h3>Home</h3>
                    </div>
                    
                    <StatusPoster db={props.db} username={props.username} user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted}/>
                        <UserStatuses db={props.db} username={props.username} user={props.user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
                    </div>
                    <div className="home-sidebar">
                        <ProfileSuggestions db={props.db} username={props.username} user={props.user} />
                        </div>
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
            
            <LoggedIn />
            
        </div>
        
    );
};

export default Homepage;