import { useState } from "react";
import Routes from './Routes';
import { nanoid } from 'nanoid'

const RoutesWrapper = (props) => {

  const [routesId, setRoutesId] = useState(nanoid());

    const changeRoutesId = () => {

        setRoutesId(nanoid());
    };
  
    return (
        <Routes key={routesId} changeRoutesId={changeRoutesId}/>
        
    );
};

export default RoutesWrapper; 