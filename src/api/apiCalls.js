// Este fuente contiene las funciones para realizar peticiones API al exterior.
import axios from 'axios';

export const signup = (user) => {
  // Aquí tenemos la primera llamada y el primer parámetro es el path
  return axios.post('/api/1.0/users', user);
};
