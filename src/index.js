import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import './style.css';
import Context from './context/Context';

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <Routes/>
    </Context>
    
  </React.StrictMode>,
  document.getElementById('root')
);
