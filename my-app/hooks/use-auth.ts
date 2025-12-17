import { useState, useEffect, useCallback } from 'react';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Sign in with Google
      const response = await GoogleSignin.signIn();
      
      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        
        if (!idToken) {
          throw new Error('No ID token received from Google Sign-In');
        }

        // Sign in to Supabase with Google ID token
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });

        if (error) {
          throw error;
        }
      } else {
        // User cancelled the sign-in
        console.log('Sign-in cancelled by user');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Sign out from Google
      await GoogleSignin.signOut();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }, []);

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    signInWithGoogle,
    signOut,
  };
}
