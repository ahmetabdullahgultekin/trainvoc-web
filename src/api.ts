import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.60.65.245:8080', // Uzak sunucu adresi güncellendi
  withCredentials: true // Gerekirse çerez desteği
});

export default api;
