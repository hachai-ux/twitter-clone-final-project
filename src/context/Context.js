import { createContext, useReducer } from 'react';
import { userReducer } from "./Reducers";

const UserContext = createContext();
    
const Context = ({ children }) => {
    

    //useReducer will help manage state via a reducer function
    const [userState, dispatch] = useReducer(userReducer, []
    );

    return (
        //provide values for context, values managed by reducer
        <UserContext.Provider value={{ userState, dispatch }}>
            {/* provider wraps around children  */}
            {children}
        </UserContext.Provider>
    )
}

export default Context;

//export context
export { UserContext };
