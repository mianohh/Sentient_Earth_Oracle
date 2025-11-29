import axios from 'axios';
import { OracleRequest, OracleResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export class ApiService {
  static async generateOracleResponse(request: OracleRequest): Promise<OracleResponse> {
    try {
      const response = await api.post('/oracle/generate', request);
      return response.data.data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate oracle response');
    }
  }

  static async getOracleResponse(id: string): Promise<OracleResponse> {
    try {
      const response = await api.get(`/oracle/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to retrieve oracle response');
    }
  }

  static async getUserHistory(): Promise<OracleResponse[]> {
    try {
      const response = await api.get('/oracle/user/history');
      return response.data.data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to retrieve user history');
    }
  }
}

export default ApiService;