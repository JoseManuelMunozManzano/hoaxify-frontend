// Este fuente contiene las funciones para realizar peticiones API al exterior.
import axios from 'axios';

export const signup = (user) => {
  // Aquí tenemos la primera llamada y el primer parámetro es el path
  return axios.post('/api/1.0/users', user);
};

export const login = (user) => {
  // Necesitamos actualizar nuestra petición con Basic Authentication.
  // Usamos los otros 2 parámetros que permite Axios, que son el request y la configuración de Axios
  // El segundo parámetro es un Json vacío porque para el login no hace falta mandar el user.
  // Para el tercer parámetro usamos auth y le pasamos el usuario, que contiene username y password
  return axios.post('/api/1.0/login', {}, { auth: user });
};
