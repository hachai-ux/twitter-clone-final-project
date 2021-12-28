import { getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { getDocs, collection, doc, setDoc, runTransaction } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'



const SignUp = (props) => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [usernameExistsState, setUsernameExistsState] = useState(false);



    const history = useHistory();

    const closeForm = (e) => {
        e.stopPropagation();
        props.closeSignup();
    }

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
                 history.push('/verification');
                console.log('pushed?');
                console.log(user.uid);
                const random = Math.random();
                //set username, but without checking for email validation(better to set username after email validation)
              

                await runTransaction(props.db, async (transaction) => {
                
                    transaction.set(doc(props.db, 'Users', username), {
                        uid: user.uid,
                        random: random,
                        username: username,
                        following: {},
                        followers: {}
                    })

                    //user always follow himself
                    /*
                    const docRefFollowers = transaction.set(doc(props.db, "Users", props.username, "Followers", props.username), {
                        uid: user.uid,
                        username: props.username,
                      
                    });

                    const docRefFollowing = transaction.set(doc(props.db, "Users", props.username, "Following", props.username), {
                        uid: user.uid,
                        username: props.username,
             
                            
                    });
                    */
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
            setUsernameExistsState(true);
        }

    }
    let errorUsername;
    if (usernameExistsState === true) {
        errorUsername = <div>Username exists</div>
    }
    else errorUsername = null;
  

    return (
        <div className="outer-overlay">
            <form className="signup-form" onSubmit={(e) => { handleSubmit(e) }}>
                <div className="form-top">
                    <FontAwesomeIcon onClick={closeForm} className="closeButton" icon={faTimes} />
                </div>
                <h1>Create Account</h1>

                <label htmlFor='username'>
                <input type="text" value={username} name="username" placeholder="Name" onChange={(e) => { handleChangeUsername(e)}}  required/>
                </label>

                {errorUsername}

                <label htmlFor='email'>
                
                <input type="email" value={email} name="email" placeholder="E-Mail" onChange={(e) => { handleChangeEmail(e)}}  required/>
                </label>
                
                <label htmlFor='password'>
                  
                <input type="password" value={password} name="password" placeholder="Password" onChange={(e) => { handleChangePassword(e)}} required/>
                </label>
                <input className="register-btn" type="submit" value="Register" />
        </form>
        </div>
    );
};

export default SignUp;