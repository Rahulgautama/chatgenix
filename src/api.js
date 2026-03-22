import axios from 'axios';

const API = axios.create({
  baseURL: "https://chatgenix.bsite.net/api"
//   baseURL: "https://localhost:7115/api"
});

// Interceptor: Har request ke sath automatically token bhejega
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Auth
// 2. Named Exports (Inhe curly braces { } ke saath import kiya jayega)
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Messages API
export const getChatHistory = (senderId, receiverId) => API.get(`/Messages/history/${senderId}/${receiverId}`);
export const sendMessage = (data) => API.post('/Messages/send', data);

//User API
export const getAllUsers = () => API.get('/user/all-users');

// Contacts API
export const getMyContacts = (ownerMobile) => API.get(`/Contacts/${ownerMobile}`);
export const addContact = (data) => API.post('/Contacts/add', data);

// 3. Default Export (Agar aap API instance use karna chahte hain)
export default API;
