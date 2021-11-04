import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useCallback } from "react";
import UserStatuses from '../components/UserStatuses';
import { useParams } from 'react-router-dom'
import ProfileStatuses from '../components/ProfileStatuses';
import { query, collection, getDocs } from "firebase/firestore";

const Profile = (props) => {

    const { profilename } = useParams();



    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [statusSubmitted, setStatusSubmitted] = useState(null);

    const changeStatusSubmitted = useCallback((bool) => {
        setStatusSubmitted(bool);
    }, []);
    
    useEffect(() => {

          
        const getUsername = async () => {

            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {

                const q = query(collection(props.db, "Users"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                    

                //loop through documents and get username for the uid
                if (doc.data().uid === user.uid) {
                    
                    setUsername(doc.id);
                }
            });
                
            };
            

        
        };
        getUsername();
        
    },[])
  
    

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


    let profileSelection;
    if (user && (user.emailVerified === true) && profilename === username) {      
             profileSelection =   <UserStatuses db={props.db} user={user} statusSubmitted={statusSubmitted} changeStatusSubmitted={changeStatusSubmitted} />
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