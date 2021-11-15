import { setDoc, doc, getDoc } from 'firebase/firestore';

const Follow = (props) => {



    const followUser = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        //add following document to following user
        //add follower document to followed user

        //follow
        try {

            //check if user is already following the profile

            console.log(props.profilename);
            const docRefProfile = doc(props.db, "Users", props.profilename);
            const docSnapProfile = await getDoc(docRefProfile);
            
         
                        
            //add following to profilename(the followed profile)
                
                const docRefFollowers = await setDoc(doc(props.db, "Users", props.profilename, "Followers", props.username), {
                uid: props.user.uid,
                username: props.username,
                });

                const docRefFollowing = await setDoc(doc(props.db, "Users", props.username, "Following", props.profilename), {
                uid: props.uid,
                username: props.profilename,
             
                            
                });
            

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