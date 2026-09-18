const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'Something went wrong. Please try again.';
    try {
      const err = await response.json();
      if (err.detail) errorDetail = err.detail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Users
  async createUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async getUser(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    return handleResponse(res);
  },

  async updateUser(userId, userData) {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async loadDemoLakshmi() {
    const res = await fetch(`${API_BASE}/users/demo/lakshmi`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  // Financial Health
  async getFinancialHealth(userId) {
    const res = await fetch(`${API_BASE}/financial-health/${userId}`);
    return handleResponse(res);
  },

  // Transactions
  async getTransactions(userId) {
    const res = await fetch(`${API_BASE}/transactions/${userId}`);
    return handleResponse(res);
  },

  async createTransaction(txData) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txData),
    });
    return handleResponse(res);
  },

  async deleteTransaction(txId) {
    const res = await fetch(`${API_BASE}/transactions/${txId}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Journey
  async getJourney(userId) {
    const res = await fetch(`${API_BASE}/journey/${userId}`);
    return handleResponse(res);
  },

  // Goals
  async getGoals(userId) {
    const res = await fetch(`${API_BASE}/goals/${userId}`);
    return handleResponse(res);
  },

  async createGoal(goalData) {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    });
    return handleResponse(res);
  },

  async updateGoal(goalId, goalData) {
    const res = await fetch(`${API_BASE}/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    });
    return handleResponse(res);
  },

  async deleteGoal(goalId) {
    const res = await fetch(`${API_BASE}/goals/${goalId}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Schemes
  async getSchemes(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.state) query.append('state', params.state);
    const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
    return handleResponse(res);
  },

  async getSchemeById(id) {
    const res = await fetch(`${API_BASE}/schemes/${id}`);
    return handleResponse(res);
  },

  async matchSchemes(criteria) {
    const res = await fetch(`${API_BASE}/schemes/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria),
    });
    return handleResponse(res);
  },

  // Ask Sakhi AI
  async askSakhi(userId, message, language = 'en') {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, message, language }),
    });
    return handleResponse(res);
  },
};
