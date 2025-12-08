// src/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create a fetch wrapper that mimics axios API
const api = {
  defaults: {
    baseURL: API_BASE_URL,
    withCredentials: true,
  },

  async request(method, url, data = null, config = {}) {
    const token = localStorage.getItem("token");
    
    const headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = url.startsWith('http') ? url : `${this.defaults.baseURL}${url}`;

    const options = {
      method,
      headers,
      credentials: this.defaults.withCredentials ? 'include' : 'same-origin',
    };

    if (data && method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, options);
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.message || 'Request failed');
        error.response = {
          status: response.status,
          data: responseData,
        };
        throw error;
      }

      return { data: responseData };
    } catch (error) {
      throw error;
    }
  },

  get(url, config) {
    return this.request('GET', url, null, config);
  },

  post(url, data, config) {
    return this.request('POST', url, data, config);
  },

  put(url, data, config) {
    return this.request('PUT', url, data, config);
  },

  delete(url, config) {
    return this.request('DELETE', url, null, config);
  },

  patch(url, data, config) {
    return this.request('PATCH', url, data, config);
  },
};

export default api;