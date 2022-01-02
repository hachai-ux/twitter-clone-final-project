import { BrowserRouter, Switch, Route, Redirect, useLocation, useHistory} from "react-router-dom";
import Nav from "./components/Nav";
import Homepage from "./sites/Homepage";
import Profile from "./sites/Profile";
import SignUp from "./sites/SignUp";
import Login from "./sites/Login";
import StatusPage from './sites/StatusPage';
import LandingPage from './sites/LandingPage';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { query, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';
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


//Bugs:
//Existing user leads to signup bug(solved)
//Users not redirected to home when reopen page while user logged in(solved)
//User statuses showing up in other profiles(no rerender?)
//Profile statuses not showing up?
//Clicking on status reply doesn't show up the status
//Deleted retweets residue
//Home Feed appearing in User page
//Clicking on status profile links to user profile

const Routes = (props) => {

    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const [newUserCreated, setNewUserCreated] = useState(false);
    const [authStateLoaded, setAuthStateLoaded] = useState(false);

    
    const history = useHistory();

  
    console.log(username);
    console.log(user);

    const changeNewUserCreatedStatus = () => {
        setNewUserCreated(true);
    }

    const resetUsername = () => {
        setUsername(null);
    }

    const changeUsername = (passedUsername) => {
        setUsername(passedUsername);
    }

    //user needs to be set before authStateLoaded

    const PrivateRoute = ({ children, ...rest }) => {
         console.log(authStateLoaded);
    
        if (authStateLoaded === true) {
            console.log(user);
    
            return (
                
                <Route {...rest} render={() => {
                
                    console.log(user);
                    return (user !== null) ? children : <Redirect to='/' />
                
                }}>

                </Route>

            )
        }
        else return null;
    };

    const LoggedInRoute = ({ children, ...rest }) => {
        if (authStateLoaded) {
            
            return (
                <Route {...rest} render={() => {
                
                    return (user === null) ? children : <Redirect to="/home" />
                
                }}>

                </Route>

            )
         
        }
        else return null;
    };

    useEffect(() => {

        //get username when new user is automatically logged in from signup

        const auth = getAuth();
        const userCurrent = auth.currentUser;

        console.log(userCurrent);

        //probably redundant
        const getUsername = async () => {
            if (userCurrent) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(userCurrent);
                console.log(user);

                
                //get username from user
                const q = query(collection(db, "Users"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    

                    //loop through documents and get username for the uid
                    if (doc.data().uid === userCurrent.uid) {
                    

                        setUsername(doc.id);
                        console.log(doc.id);
                       
                    }
                });
                
            }
    
                // ...
             else {
                // User is signed out
                // ...
                setUser(null);
                
            
                };
                
                //likely needs cleanup for user
      
       
        
        }
            
        getUsername();

    }, [newUserCreated, username]);
   

    useEffect(() => {


        const auth = getAuth();
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
           
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(user);
                console.log(user);

                
                //get username from user
                const q = query(collection(db, "Users"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    
                    //doesn't reach because not written in database yet when user is created
                    //loop through documents and get username for the uid
                    if (doc.data().uid === user.uid) {
                    

                        setUsername(doc.id);
                        console.log(doc.id);
                       
                    }
                });
                
            }
    
                // ...
             else {
                // User is signed out
                // ...
                setUser(null);
                console.log('User set to null');
                
            
                };
                
             setAuthStateLoaded(true);
                
        });
            
       return () => unsubscribe()
        

    }, []);


  
     
    




    return (
        <div className="container">
            <BrowserRouter>
                <Switch>
                                <LoggedInRoute exact path="/">
                                    <LandingPage db={db} changeNewUserCreatedStatus={changeNewUserCreatedStatus} />
                                </LoggedInRoute>
                        
                            
                            <PrivateRoute exact path="/home">
                                <Nav changeRoutesId={props.changeRoutesId} username={username} resetUsername={resetUsername}/>
                                    <div className='content'>
                                        <Homepage user={user} username={username} db={db} />
                            </div>
                            </PrivateRoute>
                           
                            <PrivateRoute exact path="/signup">
                                <Nav changeRoutesId={props.changeRoutesId} username={username} resetUsername={resetUsername} />
                                    <div className='content'>
                                <SignUp db={db} changeUsername={changeUsername} />
                                </div>
                            </PrivateRoute>
                             <PrivateRoute exact path="/login">
                                    <Nav changeRoutesId={props.changeRoutesId} username={username}resetUsername={resetUsername} />
                                        <div className='content'>
                                                <Login db={db} />
                                                </div>
                            </PrivateRoute>
                            <PrivateRoute exact path="/:profilename">
                                <Nav changeRoutesId={props.changeRoutesId} username={username} resetUsername={resetUsername}/>
                                <div className='content'>
                                <Profile user={user} username={username} db={db} />
                                </div>
                            </PrivateRoute>
                            <PrivateRoute exact path="/:profilename/status/:statusid">
                                <Nav changeRoutesId={props.changeRoutesId} username={username} resetUsername={resetUsername} />
                                <div className='content'>
                                    <StatusPage username={username} user={user} db={db} />
                                    </div>
                            </PrivateRoute>
                                </Switch>
                    </BrowserRouter>
                </div>
    )
}

export default Routes;