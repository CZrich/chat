import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
  
);

// src/auth/google.ts
export async function verifyGoogleCode(code: string) {
  try {
    console.log('Getting tokens with code...');
    const { tokens } = await client.getToken(code);
    
    if (!tokens.id_token) {
      console.error('No ID token received from Google');
      return null;
    }
    
    console.log('Verifying ID token...');
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('Payload verified:', payload?.email);
    return payload;
  } catch (err) {
    console.error('Error verifying Google code:', err);
    return null;
  }
}