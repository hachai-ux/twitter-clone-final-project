import logo from "../content/Twitter-Emblem.png";
import { useState } from 'react';
import SignUp from "./SignUp";
import Login from "./Login";

const LandingPage = (props) => {

    const [signupIsOpen, setSignupIsOpen] = useState(false);
    const [loginIsOpen, setLoginIsOpen] = useState(false);

    const openSignup = () => {
        setSignupIsOpen(true);
    }

    const openLogin = () => {
        setLoginIsOpen(true);
    }

    
    let form;
    if (signupIsOpen === true && loginIsOpen === false) {
    form = <SignUp db={props.db} />
    }
    else if (signupIsOpen === false && loginIsOpen === true) {
       form = <Login db={props.db} /> 
    }
    else form = null;
    
    


    return (

        <div className="landing-page">
            <div className="landing-background">
                <img src={logo} alt="Twitter Clone Logo"></img>
            </div>
            <div className="landing-content">
            <h1>Join Twitter's Alter-Ego</h1>
            <h2>Register for Twitter Clone.</h2>
                <button onClick={openSignup} className="btn signup-btn"><span>Signup</span></button>
                <button onClick={openLogin} className="btn login-btn"><span>Login</span></button>
            </div>
            {form}
            
        </div>
        
    );
}

export default LandingPage;