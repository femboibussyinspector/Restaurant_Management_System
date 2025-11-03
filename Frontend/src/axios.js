import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // backend base URL
  withCredentials: true, // allows cookies
});

export default api;
