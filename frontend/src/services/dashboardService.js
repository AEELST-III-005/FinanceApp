const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/dashboard`;

export const dashboardService = {
  getDashboardData: async () => {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Failed to fetch dashboard data');
    }
    return await response.json();
  }
};
