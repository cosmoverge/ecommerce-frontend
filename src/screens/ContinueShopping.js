import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContinueShopping() {
  const navigate = useNavigate();
  const handleLogIn = () => {
    navigate('/signin');
  };
  const handleContinue = () => {
    navigate('/contact-detail');
  };
  return (
    <div>
      <p>To Continue select one from the below</p>
      <div className="continueShopingButtons">
        <button
          style={{ border: 'none', borderRadius: '3px', width: '180px' }}
          onClick={handleContinue}
        >
          Continue
        </button>
        <button
          style={{
            marginTop: 'inherit',
            border: 'none',
            borderRadius: '3px',
            width: '180px',
          }}
          onClick={handleLogIn}
        >
          LogIn
        </button>
      </div>
    </div>
  );
}
