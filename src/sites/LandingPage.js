import logo from "../content/Twitter-Emblem.png";

const LandingPage = (props) => {

 


    return (

        <div className="landing-page">
            <div className="landing-background">
                <img src={logo} alt="Twitter Clone Logo"></img>
            </div>
            <div className="landing-content">
            <h1>Join Twitter's Alter-Ego</h1>
            <h2>Register for Twitter Clone.</h2>
            <button className="btn signup-btn"><span>Signup</span></button>
            <button className="btn login-btn"><span>Login</span></button>
            </div>
            
        </div>
        
    );
}

export default LandingPage;