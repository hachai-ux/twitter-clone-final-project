import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, getDocs} from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'


const Login = (props) => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const contextValue = useContext(UserContext);
    const { userState, dispatch } = contextValue;


       const closeForm = (e) => {
        e.stopPropagation();
        props.closeLogin();
       }
    
    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
    
        e.preventDefault();

       

        try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        
            const user = userCredential.user;
            // ...
            console.log(user);

            //redundant
            let username;
            const q = query(collection(props.db, "Users"));
            const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                    

                    //loop through documents and get username for the uid
                    if (doc.data().uid === user.uid) {
                        username = doc.id;
                    }
                });

            
            //username doesn't persist, so using context here is redundant
            dispatch({
                type: "SET_USER",
                payload: {
                    user: user,
                    username: username,
                    uid: user.uid
                 
                }
            })

            //test user state after dispatch
            console.log(userState);
            
            history.push('/');
        }
        
    
        catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        };

    }

  

    return (

        <div className="outer-overlay">
            <form className="login-form" onSubmit={(e) => { handleSubmit(e) }}>
                <div className="form-top">
                    <FontAwesomeIcon onClick={closeForm} className="closeButton" icon={faTimes} />
                    </div>
                <h1>Log in to Twitter Clone</h1>
                <label htmlFor='email'>
               
                <input type="email" value={email} placeholder="E-Mail" name="email" onChange={(e) => { handleChangeEmail(e) }}  required/>
                </label>
                
                <label htmlFor='password'>
                    Password:
                <input type="password" value={password} placeholder="Password" name="password" onChange={(e) => { handleChangePassword(e) }} required/>
                </label>
                    <input className="login-btn" type="submit" value="Log in" />
                    
            </form>
        </div>
        
    );
};

export default Login;