import React from 'react';
import { auth } from './firebase';

function App() {
  console.log("Firebase Auth initialized:", auth);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Cloud Android Portal</h1>
      <p>Welcome! Your Firebase connection is active.</p>
    </div>
  );
}

export default App;