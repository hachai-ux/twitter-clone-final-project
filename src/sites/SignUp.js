import { getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';


const SignUp = () => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
       

        e.preventDefault();
        
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            console.log(user);
            history.push('/Verification');
            console.log('pushed?');
        }).then(() => {
            sendEmailVerification(auth.currentUser);
            auth.signOut();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });

    }

  

    return (
        <form onSubmit={(e) => { handleSubmit(e) }}>
            <h1>Sign up</h1>
            <label htmlFor='email'>
            E-mail:
            <input type="email" value={email} name="email" onChange={(e) => { handleChangeEmail(e) }}  required/>
            </label>
            
            <label htmlFor='password'>
                Password:
            <input type="password" value={password} name="password" onChange={(e) => { handleChangePassword(e) }} required/>
        </label>
        <input type="submit" value="Sign up" />
        </form>
        
    );
};

export default SignUp;