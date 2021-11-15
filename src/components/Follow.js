import { setDoc, doc, getDoc, runTransaction } from 'firebase/firestore';

const Follow = (props) => {



    const followUser = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        //add following document to following user
        //add follower document to followed user

        //follow
        try {
          
            //check if user is already following the profile

            const docRefFollowing = doc(props.db, "Users", props.username, 'Following', props.profilename );
            const docSnapFollowing = await getDoc(docRefFollowing);
            if (!docSnapFollowing.exists()) {

                             
            //add following to profilename(the followed profile)
                
                  await runTransaction(props.db, async (transaction) => {
                
                           const docRefFollowers = transaction.set(doc(props.db, "Users", props.profilename, "Followers", props.username), {
                uid: props.user.uid,
                username: props.username,
                });

                const docRefFollowing = transaction.set(doc(props.db, "Users", props.username, "Following", props.profilename), {
                uid: props.uid,
                username: props.profilename,
             
                            
                });
            })
                
           
                
            }
            
         
           
            

            }

           
         
        
  catch(error) {
    console.error('Error writing new document to Firebase Database', error);
  }

       
     }
       


    return (
        <div>
            <button onClick={(e) => followUser(e)}>Follow</button>
        </div>
    )
}

export default Follow;