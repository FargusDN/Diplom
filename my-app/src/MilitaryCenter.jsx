import React, { useState, useEffect } from 'react';
import PageBuilder  from './PageBuilder';
import  MTC  from './MTC';
import './MilitaryCenter.css';
import Header from './Header';
import Footer from './Footer';


export const MilitaryCenter = () => {
  

  return (
    <div className="app">
      <div className="preview-section">
        <MTC />
      </div>
    </div>
  );
};
export default MilitaryCenter;