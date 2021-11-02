import { getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { getDocs, collection, doc, setDoc} from "firebase/firestore";



const SignUp = (props) => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [usernameExists, setUsernameExists] = useState(false);



    const history = useHistory();

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

     const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();


        const querySnapshot = await getDocs(collection(props.db, "Users"));
        const usernameExists = querySnapshot.docs.some((doc) => {
        // doc.data() is never undefined for query doc snapshots
            return doc.id === username
        });
        if (usernameExists === false) {

            try {

                const auth = getAuth();
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user;
                // ...
                console.log(user);
                setUsernameExists(false);
                history.push('/Verification');
                console.log('pushed?');
                console.log(user.uid);
                //set username, but without checking for email validation(better to set username after email validation)
                await setDoc(doc(props.db, "Users", username), {
                    uid: user.uid
                });
        
                await sendEmailVerification(auth.currentUser);
                auth.signOut();
            }
        
            catch(error){
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            // ..
                        };
            
                }
        
        else {
            setUsernameExists(true);
        }

    }
    let errorUsername;
    if (usernameExists === true) {
        errorUsername = <div>Username exists</div>
    }
    else errorUsername = null;
  

    return (
        <form onSubmit={(e) => { handleSubmit(e) }}>
            <h1>Sign up</h1>

            <label htmlFor='username'>
            Username*:
            <input type="text" value={username} name="username" onChange={(e) => { handleChangeUsername(e)}}  required/>
            </label>

            {errorUsername}

            <label htmlFor='email'>
            E-mail*:
            <input type="email" value={email} name="email" onChange={(e) => { handleChangeEmail(e)}}  required/>
            </label>
            
            <label htmlFor='password'>
                Password*:
            <input type="password" value={password} name="password" onChange={(e) => { handleChangePassword(e)}} required/>
        </label>
        <input type="submit" value="Sign up" />
        </form>
        
    );
};

export default SignUp;