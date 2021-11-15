import { setDoc, doc, getDoc, runTransaction } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const Follow = (props) => {

    const [docSnapFollowing, setDocSnapFollowing] = useState(null);
    const [following, setFollowing] = useState(null);

  


    useEffect(() => {
        
        const checkFollowing = async () => {
            //check if user is already following the profile
            if (props.username !== null) {
                
                console.log(props.username);
                const docRefFollowing = doc(props.db, "Users", props.username, "Following", props.profilename);
                console.log(docRefFollowing);
                setDocSnapFollowing(await getDoc(docRefFollowing));
                
            }
           
        }
        checkFollowing();
          
        
    }, [props.username, following]);

    const followUser = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        //add following document to following user
        //add follower document to followed user

        //follow
        try {
          
            if (!docSnapFollowing.exists()) {

                             
            //add following to profilename(the followed profile)
                
                await runTransaction(props.db, async (transaction) => {
                
                    const docRefFollowers = transaction.set(doc(props.db, "Users", props.profilename, "Followers", props.username), {
                        uid: props.user.uid,
                        username: props.username,
                    });

                    const docRefFollowing = transaction.set(doc(props.db, "Users", props.username, "Following", props.profilename), {
                        uid: props.profileSnap.data().uid,
                        username: props.profilename,
             
                            
                    });
                });
                setFollowing(true);
                
            }
            else if (docSnapFollowing.exists()) {
                //unfollow if already followed

                await runTransaction(props.db, async (transaction) => {
                
                    transaction.delete(doc(props.db, "Users", props.profilename, "Followers", props.username));
                    transaction.delete(doc(props.db, "Users", props.username, "Following", props.profilename));
             
                            
                 
                });
                 setFollowing(false);
            };
            
         
           
            

            }

           
    
         
        
  catch(error) {
    console.error('Error writing new document to Firebase Database', error);
  }

       
     }
       
    
    let showButton;
    if (docSnapFollowing !== null)
    {
           if (!docSnapFollowing.exists()) {
            showButton = <button onClick={(e) => followUser(e)}>Follow</button>
        }

           else if (docSnapFollowing.exists()) {
               console.log(docSnapFollowing);
            showButton = <button onClick={(e) => followUser(e)}>Following</button>
        }
        
    }
 


    return (
        <div>
            {showButton}
        </div>
    )
}

export default Follow;