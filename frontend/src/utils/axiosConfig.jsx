// src/utils/axiosConfig.js
import axios from 'axios';

// Création d'une instance Axios
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Ajout d'un intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Si le token existe, l'ajouter à l'en-tête de la requête
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;