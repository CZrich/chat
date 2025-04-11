// src/routes/auth.ts
import express from 'express';
import { verifyGoogleCode } from '../auth/google.js';
import Author from '../models/Atuthor.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/google', async (req, res) => {
  console.log('Received code:', req.body.code); // Log the received code
  const { code } = req.body;

  if (!code) {
    console.error('No code provided');
    return res.status(400).json({ error: 'No code provided' });
  }
  try {
    const payload = await verifyGoogleCode(code);
    console.log('Google payload:', payload); // Log the payload from Google

    if (!payload) {
      console.log('Invalid Google code or payload'); // Log invalid payload

      return res.status(401).json({ error: 'Código de Google inválido' });
    }
    console.log('Google payload verified:', payload.email);
    // Buscar o crear usuario
    let user = await Author.findOne({ email: payload.email });
    console.log('Existing user:', user); // Log if user was found
    if (!user) {
      console.log('Creating new user for:', payload.email);

      user = new Author({
        name: payload.name,
        email: payload.email,
        friends: [],
      });
      try {
        


        await user.save();
        console.log('New user created:', user);
      } catch (saveError) {
        console.error('Error saving user:', saveError);
        return res.status(500).json({ error: 'Error creating user' });
      }
    }

    // Generar token JWT
    const token = jwt.sign(
      { email: user.email ,
        name: user.name,
        id: user._id
        
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

console.log('Token JWT generado:', token); // 👈👈

    res.json({ token });
  } catch (error) {
    console.error('Error al autenticar:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
// Add this test route to check token verification
router.get('/test-jwt', (req, res) => {
  try {
    const testPayload = { email: 'test@example.com', name: 'Test User', id: '123456' };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    
    // Verify the token to make sure it works
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    res.json({ 
      success: true, 
      token,
      decoded,
      secret: process.env.JWT_SECRET!.substring(0, 5) + '...' // Show first few chars for debugging
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
export default router;
