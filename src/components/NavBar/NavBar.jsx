import React from 'react'
import "./NavBar.css";

export default function NavBar() {

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const goToTransfer = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  const goToAirDrop = () => {
    window.scrollTo({
      top: (document.body.scrollHeight) / 3,
      behavior: "smooth"
    });
  };
  
  return (
    <div className='navbar-container'>
      <img src="./solana.png" alt="solana"></img>
      <p onClick={goToTop}>Connect / Disconnect</p>
      <p onClick={goToAirDrop}>Air Drop</p>
      <p onClick={goToTransfer}>Transfer</p>
    </div>
  );
};

