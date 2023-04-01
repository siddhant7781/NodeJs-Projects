//const { post } = require("../../routes/viewRoutes");
import axios from 'axios';
import { showAlert } from './alerts'
export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in Successfully')
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        alert('error', err.response.data)
    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if (res.data.status === 'success') {
            location.reload(true);
        }
    } catch (err) {
        showAlert('error', 'error logging out! try again!')
    }
}

