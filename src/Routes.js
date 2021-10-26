import { BrowserRouter, Switch, Route} from "react-router-dom";
import Nav from "./components/Nav";
import Homepage from "./sites/Homepage";
import UserProfile from "./sites/UserProfile";
import Status from "./sites/Status";
import SignUp from "./sites/SignUp";
import Verification from "./sites/Verification";


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
    return (
        <BrowserRouter>
            <Nav />
            <div className='content'>
            <Switch>
                    <Route exact path="/">
                        <Homepage />
                    </Route>
                    <Route exact path="/user-profile">
                        <UserProfile />    
                    </Route>
                    <Route exact path="/status">
                        <Status />
                    </Route>
                    <Route exact path="/signup">
                        <SignUp />
                    </Route>
                    <Route exact path="/verification">
                        <Verification />
                    </Route>
                    
                    
                </Switch>
            </div>
       
           
        </BrowserRouter>
    )
}

export default Routes;