import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import Context from './context/Context';
import { useState } from 'react';
import RoutesWrapper from './RoutesWrapper';



ReactDOM.render(
  <React.StrictMode>
    <Context>
      <RoutesWrapper />
    </Context>
    
  </React.StrictMode>,
  document.getElementById('root')
);
