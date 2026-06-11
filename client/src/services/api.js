import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async setLights(state, dimming, color, temperature) {
    const formData = new FormData();
    formData.append('state', state ? 'true' : 'false');
    formData.append('d', dimming.toString());
    formData.append('r', color.r.toString());
    formData.append('g', color.g.toString());
    formData.append('b', color.b.toString());
    formData.append('c', temperature.c.toString());
    formData.append('w', temperature.w.toString());

    try {
      const response = await this.client.post('/lights', formData);
      return response.data;
    } catch (error) {
      console.error('Error setting lights:', error);
      throw error;
    }
  }

  async getLightState() {
    try {
      const response = await this.client.get('/lights/state');
      return response.data;
    } catch (error) {
      console.error('Error getting light state:', error);
      throw error;
    }
  }

  async getLightConfig() {
    try {
      const response = await this.client.get('/lights/config');
      return response.data;
    } catch (error) {
      console.error('Error getting light config:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export default new ApiService();
