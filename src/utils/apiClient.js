export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || null;
  }
  return null;
};

// Mock API client that simulates attaching token to requests
export const mockApiCall = async (handler) => {
  // In a real implementation you would use fetch/axios and set Authorization header
  const token = getAuthToken();
  // For mock purposes we just pass token to the handler
  return handler(token);
};
