import axios from 'axios';

const BASE_URL = 'https://tidy-jars-beg.loca.lt';

export const loginUser = async (username, password) => {
  try {
    console.log(BASE_URL)
    const response = await axios.post(`${BASE_URL}/login`, { username, password });
    console.log(BASE_URL);
    return response.data; // Assuming the API returns some user data upon successful login
  } catch (error) {
    throw new Error('Failed to login'); // Handle error appropriately
  }
};