import { useEffect, useState } from "react";
import { orderBy, startAt, limit, query, collectionGroup, collection, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Follow from './Follow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';


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
                const usernamePath = `/${doc.data().username}`;
                return <li>
                   <div className="profile-suggestions-content">
                        <Link to={usernamePath}>
                         
                                 <FontAwesomeIcon icon={faUserCircle} size="2x" />
                                <h5>{doc.data().username}</h5>
                           
                    </Link>
                        <Follow db={props.db} profileSnap={doc} profilename={doc.data().username} username={props.username} user={props.user} />
                        </div>
                </li>
            
            }
            else return null;
        }
    
   
       
        
        )
    }

    return (
        <div className="profile-suggestions">
            <h4>Who to follow</h4>
            <ul>
                {profileItems}
            </ul>
        </div>
    )
}

export default ProfileSuggestions;