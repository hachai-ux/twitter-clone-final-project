import { useEffect, useState } from "react";
import { orderBy, startAt, limit, query, collectionGroup, collection, where, getDocs } from 'firebase/firestore';


const ProfileSuggestions = (props) => {


const [profileDocs, setProfileDocs] = useState([]);


    useEffect(() => {
        const getUsers = async () => {

            if (props.username !== null) {

                let newProfileDocs = [];

            console.log(props.username);

                
                const random = Math.random();
                //does random work?
            const q = query(collection(props.db, "Users"), where('username', '!=', props.username), orderBy('username'), orderBy('random'), startAt(random), limit(100));
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot);


                 const shuffle = (sourceArray) => {
                    let j, x, i;
                    for (i = sourceArray.length - 1; i > 0; i--) {
                        j = Math.floor(Math.random() * (i + 1));
                        x = sourceArray[i];
                        sourceArray[i] = sourceArray[j];
                        sourceArray[j] = x;
                    }
                    return sourceArray;
                }
              
                const shuffledQuerySnapshot = shuffle(querySnapshot.docs);
                  console.log(shuffledQuerySnapshot);

            //filter with client since filter via firebase doesn't work well
            //only get 5 docs
                let counter = 0;

             

        
            shuffledQuerySnapshot.every((doc) => {
                // doc.data() is never undefined for query doc snapshots
  
                if (!doc.data().followers.hasOwnProperty(props.username)) {
               
                    newProfileDocs = newProfileDocs.concat(doc);
                    counter++;
                }
                if (counter > 5) {
                    console.log('break');
                    return false
                }
                else return true;

                
            });
               
                
            
           
            setProfileDocs(newProfileDocs)
            
            //avoid duplicates
            

            //user itself needs to be filtered!

            }

           
        }
        getUsers();
    },[])

    let profileItems;
    if (profileDocs !== undefined && profileDocs !== null) {
        console.log(profileDocs);
        profileItems = profileDocs.map((doc) => {
            if (doc !== null) {
                return <li>{doc.data().username}</li>
            }
            else return null;
        }
    
   
       
        
        )
    }

    return (
        <div className="profile-suggestions">
            <p>Who to follow</p>
            {profileItems}
        </div>
    )
}

export default ProfileSuggestions;