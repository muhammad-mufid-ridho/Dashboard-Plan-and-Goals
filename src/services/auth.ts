import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

let cachedAccessToken: string | null = typeof window !== 'undefined'
  ? window.sessionStorage.getItem('pgd_google_access_token')
  : null;

export const initAuth = (
  onAuthSuccess?: (user: User, token?: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('pgd_google_access_token');
      }
      if (onAuthFailure) {
        onAuthFailure();
      }
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken?: string | null } | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('pgd_google_access_token', credential.accessToken);
      }
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('pgd_google_access_token');
    }
  }
};
