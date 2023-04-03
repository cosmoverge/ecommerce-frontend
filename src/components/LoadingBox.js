import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        display: 'fixed',
        // top: '50%',
        // left: '50%',
        marginTop: '100px',
        marginLeft: '346px',
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
