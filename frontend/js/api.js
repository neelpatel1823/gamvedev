const API_BASE_URL = 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.details || `Request failed (${response.status})`);
  }
  return data;
}

const TeamsAPI = {
  getAll: () => apiRequest('/teams'),
  getById: (id) => apiRequest(`/teams/${id}`),
  create: (teamData) =>
    apiRequest('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    }),
  update: (id, teamData) =>
    apiRequest(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    }),
  delete: (id) =>
    apiRequest(`/teams/${id}`, {
      method: 'DELETE',
    }),
};

const GamesAPI = {
  getAll: () => apiRequest('/games'),
  getById: (id) => apiRequest(`/games/${id}`),
  create: (gameData) =>
    apiRequest('/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    }),
  update: (id, gameData) =>
    apiRequest(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    }),
  delete: (id) =>
    apiRequest(`/games/${id}`, {
      method: 'DELETE',
    }),
};
