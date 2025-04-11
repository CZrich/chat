const TOKEN_KEY = 'google_token';

export const authService = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    console.log('token stored',token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isLoggedIn: (): boolean => {
    return !!authService.getToken();
  },
};
