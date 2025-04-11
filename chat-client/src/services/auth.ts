

export async function loginWithGoogleCode(code: string): Promise<string | null> {
    try {

      console.log('Sending code to backend...', code.substring(0, 10) + '...');
      const response = await fetch('http://localhost:4000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
      console.error('Authentication failed:', response.status, errorData);
      return null;
      }
  
      const { data } = await response.json();
      console.log('Auth response received:', data);
      if (!data.token) {
        console.error('No token in response');
        return null;
      }
  
      return data.token;
    } catch (error) {
      console.error('Error al autenticar con Google:', error);
      return null;
    }
  }
  