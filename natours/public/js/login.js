//const { post } = require("../../routes/viewRoutes");
import axios from 'axios';
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
            alert('Logged in Successfully')
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        alert(err.response.data)
    }
}


