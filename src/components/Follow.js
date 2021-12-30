import { setDoc, doc, getDoc, runTransaction, deleteField } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const Follow = (props) => {

    const [docSnapFollowing, setDocSnapFollowing] = useState(null);
    const [following, setFollowing] = useState(null);

  


    useEffect(() => {
        
        const checkFollowing = async () => {
            //check if user is already following the profile
            if (props.username !== null) {
                
                console.log(props.username);
                const docRefFollowing = doc(props.db, "Users", props.username);
                console.log(docRefFollowing);
                const docFollowing = await getDoc(docRefFollowing);
                if (docFollowing.data().following) {
                    console.log(docSnapFollowing);
                    if (docFollowing.data().following.hasOwnProperty(props.profilename)) {
                        
                       
                    }
                    
                 
                }
                   setDocSnapFollowing(docFollowing);

                
                
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
          
            if (!docSnapFollowing.data().following.hasOwnProperty(props.profilename)) {

                             
            //add following to profilename(the followed profile)
                
                await runTransaction(props.db, async (transaction) => {
                
                    //Followers
                    const docRefFollowers = transaction.update(doc(props.db, "Users", props.profilename), {
                      
                        followers: {
                             [`${props.username}`]: props.user.uid
                        }
                      
                    });
                    //Following
                    const docRefFollowing = transaction.update(doc(props.db, "Users", props.username), {
                       
                        following: {
                        [`${props.profilename}`]: props.profileSnap.data().uid
                    }   
             
                            
                    });
                });
                setFollowing(true);
                
            }
            else if (docSnapFollowing.data().following.hasOwnProperty(props.profilename)) {
                //unfollow if already followed

                await runTransaction(props.db, async (transaction) => {
                
                    transaction.update(doc(props.db, "Users", props.profilename), {[`followers.${props.username}`]: deleteField()});
                    transaction.update(doc(props.db, "Users", props.username), { [`following.${props.profilename}`]: deleteField()});
             
                            
                 
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
           if (!docSnapFollowing.data().following.hasOwnProperty(props.profilename)) {
            showButton = <button className="follow-btn" onClick={(e) => followUser(e)}>Follow</button>
        }

           else if (docSnapFollowing.data().following.hasOwnProperty(props.profilename)) {
               console.log(docSnapFollowing);
            showButton = <button className="follow-btn" onClick={(e) => followUser(e)}>Following</button>
        }
        
    }
    else showButton = <button className="follow-btn" onClick={(e) => followUser(e)}>Follow</button>
 


    return (
        <div>
            {showButton}
        </div>
    )
}

export default Follow;