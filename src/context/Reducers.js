export const userReducer = (userState, action) => {
    
    switch (action.type) {
        case "SET_USER":
            //get user
            console.log(action.payload);
           
            return action.payload;

        
        case "LOGOUT":
            //functionality not implemented yet
            return null;


        default: return userState;
    }
};