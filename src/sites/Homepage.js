import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import StatusPoster from '../components/StatusPoster';

const Homepage = (props) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(user);
                
    
                // ...
            } else {
                // User is signed out
                // ...
                setUser(null);
                
            
            };
        });

    }, []);
  
    
    const LoggedIn = () => {

        if (user && (user.emailVerified === true)) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;

            return (
                
                <div>
                    <StatusPoster db={props.db} user={user} />
                    {uid}
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