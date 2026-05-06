const MOCK_USERS = {
  'principal@school.com': { id: 'p1', role: 'principal', name: 'Principal Smith' },
  'teacher@school.com': { id: 't1', role: 'teacher', name: 'Teacher John' },
};

export const authService = {
  login: async (email, password) => {
    // Mock API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (MOCK_USERS[email] && password === 'password123') {
          const user = MOCK_USERS[email];
          const token = `mock-jwt-token-${user.id}`;
          
          // In a real app, this might be handled by cookies/session
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          resolve({ user, token });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800); // simulate network latency
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
};
