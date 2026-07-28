import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);

  // 1. Secret 5-second Hold Logic
  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      setUnlocked(true);
    }, 5000);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // 2. Track Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error("Firestore read error:", err);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Login & Registration Handler
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        // Create user in Auth
        const res = await createUserWithEmailAndPassword(auth, email, password);
        
        // Initial Firestore profile structure
        const newUserProfile = {
          email: res.user.email,
          createdAt: new Date().toISOString(),
          tier: "free",
          vmStatus: "stopped",
          allocatedVmId: ""
        };

        // Save profile to Firestore
        await setDoc(doc(db, "users", res.user.uid), newUserProfile);
        setUserData(newUserProfile);
      } else {
        // Log in existing user
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Screen 1: Hidden 404 Cover Page
  if (!unlocked) {
    return (
      <div 
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        style={{ 
          height: '100vh', 
          backgroundColor: '#ffffff', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          userSelect: 'none',
          cursor: 'default'
        }}
      >
        <h1 style={{ fontFamily: 'sans-serif', color: '#333', fontSize: '32px', margin: 0 }}>404</h1>
        <p style={{ fontFamily: 'sans-serif', color: '#666', marginTop: '8px' }}>Page Not Found</p>
      </div>
    );
  }

  // Screen 2: Portal App (Post 5-second Hold)
  return (
    <div style={{ maxWidth: '360px', margin: '50px auto', fontFamily: 'sans-serif', padding: '24px', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>Cloud Android Portal</h2>

      {user ? (
        <div>
          <p><strong>Logged in as:</strong> {user.email}</p>
          <p><strong>Account Tier:</strong> {userData?.tier || 'free'}</p>
          <p><strong>VM Status:</strong> <span style={{ color: userData?.vmStatus === 'running' ? 'green' : 'orange' }}>{userData?.vmStatus || 'stopped'}</span></p>
          
          <button style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            Launch Android VM
          </button>

          <button onClick={() => signOut(auth)} style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Log Out
          </button>
        </div>
      ) : (
        <form onSubmit={handleAuth}>
          <h3 style={{ marginTop: 0 }}>{isRegistering ? 'Create Account' : 'Log In'}</h3>
          
          {error && <p style={{ color: 'red', fontSize: '13px', backgroundColor: '#ffe6e6', padding: '8px', borderRadius: '4px' }}>{error}</p>}

          <input 
            type="email" 
            placeholder="Email address" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginBottom: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} 
          />

          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginBottom: '16px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} 
          />

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Connecting...' : (isRegistering ? 'Sign Up' : 'Log In')}
          </button>

          <p style={{ textAlign: 'center', cursor: 'pointer', color: '#007bff', fontSize: '14px', marginTop: '16px', marginBottom: 0 }} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </p>
        </form>
      )}
    </div>
  );
}

export default App;