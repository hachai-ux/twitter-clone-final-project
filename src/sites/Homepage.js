import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const Homepage = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                setUser(user);
                
    
                // ...
            } else {
                // User is signed out
                // ...
                setUser(null);
                
            
            };
        });

    }, []);
  
    
    const UserData = () => {

        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;

            return (
                <div>{uid}</div>
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
            <UserData />
            
        </div>
        
    );
};

export default Homepage;