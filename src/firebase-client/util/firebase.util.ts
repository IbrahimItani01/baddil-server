import axios from 'axios';
const APIS_BASE_URL = 'http://200.200.200.104:8800/api';

export const checkUserByEmail = async (email: string): Promise<boolean> => {
  return axios
    .post(`${APIS_BASE_URL}/users/check-email`, { email })
    .then((response) => {
      return response.data.success;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};
