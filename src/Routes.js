import { BrowserRouter, Switch, Route} from "react-router-dom";
import Nav from "./components/Nav";
import Homepage from "./sites/Homepage";
import Profile from "./sites/Profile";
import Status from "./sites/Status";
import SignUp from "./sites/SignUp";
import Login from "./sites/Login";
import Verification from "./sites/Verification";

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { query, collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';


// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdHMpXvsbR_4G5N-YaCUbm-dAZ3qCAFZs",
  authDomain: "twitter-clone-16a7c.firebaseapp.com",
  projectId: "twitter-clone-16a7c",
  storageBucket: "twitter-clone-16a7c.appspot.com",
  messagingSenderId: "529507935952",
  appId: "1:529507935952:web:ee8a3a7649e571c58860d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/*
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  // Other config options...
});
*/


const Routes = () => {

    const [username, setUsername] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {

          
        const getUsername = async () => {

            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {

                const q = query(collection(db, "Users"));
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


    return (
        <BrowserRouter>
            <Nav username={username}/>
            <div className='content'>
            <Switch>
                    <Route exact path="/">
                        <Homepage db={db} />
                    </Route>
                    <Route exact path="/status">
                        <Status />
                    </Route>
                    <Route exact path="/signup">
                        <SignUp db={db} />
                    </Route>
                    <Route exact path="/verification">
                        <Verification />
                    </Route>
                     <Route exact path="/login">
                        <Login db={db} />
                    </Route>
                     <Route exact path="/:profile">
                        <Profile user={user} username={username} db={db} />
                    </Route>
                </Switch>
            </div>
       
           
        </BrowserRouter>
    )
}

export default Routes;