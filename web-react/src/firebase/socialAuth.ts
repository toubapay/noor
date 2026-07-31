import {
  GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signInWithPopup, type UserCredential,
} from 'firebase/auth';
import { firebaseAuth, firebaseConfigured } from '@/firebase/config';

export type SocialMedium = 'google' | 'facebook' | 'apple';

export interface SocialSignInResult {
  medium: SocialMedium;
  uniqueId: string;
  email: string | null;
  name: string | null;
  idToken: string;
}

function assertConfigured() {
  if (!firebaseConfigured || !firebaseAuth) {
    throw new Error(
      'Firebase is not configured. Set VITE_FIREBASE_* env vars (see .env.example) to enable social login.',
    );
  }
}

async function toResult(medium: SocialMedium, credential: UserCredential): Promise<SocialSignInResult> {
  const idToken = await credential.user.getIdToken();
  return {
    medium,
    uniqueId: credential.user.uid,
    email: credential.user.email,
    name: credential.user.displayName,
    idToken,
  };
}

export async function signInWithGoogle(): Promise<SocialSignInResult> {
  assertConfigured();
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(firebaseAuth!, provider);
  return toResult('google', credential);
}

export async function signInWithFacebook(): Promise<SocialSignInResult> {
  assertConfigured();
  const provider = new FacebookAuthProvider();
  const credential = await signInWithPopup(firebaseAuth!, provider);
  return toResult('facebook', credential);
}

export async function signInWithApple(): Promise<SocialSignInResult> {
  assertConfigured();
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  const credential = await signInWithPopup(firebaseAuth!, provider);
  return toResult('apple', credential);
}
