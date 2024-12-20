import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { Rnd } from 'react-rnd';

function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const roomRef = useRef(null);
  const containerRef = useRef(null);

  const onCall = useSelector((state) => state.core.onCall);

  // Attach listener on component mount and clean it up on unmount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        // Perform additional user setup if needed
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return 'LOADING';
  }

  if (!authenticated) {
    return <Navigate to="/signin" />;
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  return (
    <>
      <div
        style={{
          zIndex: onCall ? 99999999999 : 0,
          position: 'absolute',
        }}
      >
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: '300px',
            height: '200px',
          }}
          onResize={debounce((e, direction, ref, delta, position) => {
            requestAnimationFrame(() => {
              ref.style.border = '1px solid lightgray';
            });
          }, 100)}
        >
          <div
            ref={containerRef}
            className="roomContainer"
            id="roomContainer"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
        </Rnd>
      </div>
      {children}
    </>
  );
}

export default PrivateRoute;
