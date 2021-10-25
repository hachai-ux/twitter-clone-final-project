import { BrowserRouter, Switch, Route} from "react-router-dom";
import Nav from "./components/micro-components/Nav";
import Homepage from "./components/sites/Homepage";
import UserProfile from "./components/sites/UserProfile";
import Status from "./components/sites/Status";


const Routes = () => {
    return (
        <BrowserRouter>
            <Nav />
            <Switch>
                <Route exact path="/">
                    <Homepage />
                </Route>
                <Route exact path="/user-profile">
                    <UserProfile />    
                </Route>
                <Route exact path="/status">
                    <Status />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;