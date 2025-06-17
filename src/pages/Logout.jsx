import axios from 'axios';

const Logout = async () => {
  try {
    await axios.post('/auth/logout', {}, { withCredentials: true });
    localStorage.removeItem('token'); // if you stored anything
    console.log(localStorage.getItem('token'))
    //window.location.href = '/login';  // redirect to login
  } catch (err) {
    console.error('Logout failed', err);
  }
};
export default Logout
