import { useEffect, useState } from "react";
import { orderBy, startAt, limit, query, collectionGroup, collection, where, getDocs } from 'firebase/firestore';


const ProfileSuggestions = (props) => {


const [profileDocs, setProfileDocs] = useState([]);


    useEffect(() => {
        const getUsers = async () => {

            if (props.username !== null) {

            let newProfileDocs

            console.log(props.username);

                const random = Math.random();
            const q = query(collection(props.db, "Users"), where('username', '!=', props.username), orderBy('username'),  limit(1));
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot);
            // eslint-disable-next-line no-loop-func
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                 newProfileDocs = profileDocs.concat(doc);
            });
               
                
            
           
            setProfileDocs(newProfileDocs)
            
            //avoid duplicates
            

            //user itself needs to be filtered!

            }

           
        }
        getUsers();
    },[])

    const profileItems = profileDocs.map((doc) => {
        if (doc !== null) {
            return <li>{doc.data().username}</li>
        }
        else return null;
    }
       
        
    )

    return (
        <div className="profile-suggestions">
            <p>Who to follow</p>
            {profileItems}
        </div>
    )
}

export default ProfileSuggestions;