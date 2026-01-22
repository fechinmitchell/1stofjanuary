import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { syncUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [capacityError, setCapacityError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync user to backend
        try {
          await syncUser();
          console.log('✅ User synced to backend');
          setUser(firebaseUser);
          setCapacityError(false);
        } catch (error) {
          console.log('⚠️ Could not sync user to backend:', error.message);
          
          // Check if it's a capacity error
          if (error.isCapacityFull || error.shouldShowWaitlist) {
            console.log('🚫 Capacity full - signing out user');
            setCapacityError(true);
            // Sign out the user since they can't use the app
            await signOut(auth);
            setUser(null);
          } else {
            // Other errors - still allow the user in (fail open for existing users)
            setUser(firebaseUser);
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setCapacityError(false);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Try to sync user (this will check capacity for new users)
      try {
        await syncUser();
        console.log('✅ User synced to backend');
        return result.user;
      } catch (syncError) {
        // If capacity is full, sign out and throw
        if (syncError.isCapacityFull || syncError.shouldShowWaitlist) {
          console.log('🚫 Capacity full - signing out user');
          setCapacityError(true);
          await signOut(auth);
          throw syncError;
        }
        // Other sync errors - let them through (existing user)
        console.log('⚠️ Sync failed but continuing:', syncError.message);
        return result.user;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCapacityError(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      logout,
      capacityError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};