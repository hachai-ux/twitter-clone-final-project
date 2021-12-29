import { useState } from "react";
import Routes from './Routes';
import { nanoid } from 'nanoid'

const RoutesWrapper = (props) => {

  const [routesId, setRoutesId] = useState(nanoid());

    const changeRoutesId = () => {

        console.log("change ID");
        setRoutesId(nanoid());
    };
  
    return (
        <Routes key={routesId} changeRoutesId={changeRoutesId}/>
        
    );
};

export default RoutesWrapper; 