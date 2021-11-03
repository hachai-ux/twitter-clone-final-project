import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, getDocs} from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/Context';


const Login = (props) => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const contextValue = useContext(UserContext);
    const { userState, dispatch } = contextValue;

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
        <form onSubmit={(e) => { handleSubmit(e) }}>
            <h1>Log in</h1>
            <label htmlFor='email'>
            E-mail:
            <input type="email" value={email} name="email" onChange={(e) => { handleChangeEmail(e) }}  required/>
            </label>
            
            <label htmlFor='password'>
                Password:
            <input type="password" value={password} name="password" onChange={(e) => { handleChangePassword(e) }} required/>
        </label>
        <input type="submit" value="Log in" />
        </form>
        
    );
};

export default Login;