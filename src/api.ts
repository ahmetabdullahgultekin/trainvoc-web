import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.trainvoc.rollingcatsoftware.com:8443/', // Yeni backend URL
    withCredentials: true // Gerekirse çerez desteği
});

export default api;
