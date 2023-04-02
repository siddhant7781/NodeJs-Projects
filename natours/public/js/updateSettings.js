import axios from 'axios';
import { showAlert } from './alerts';


//type is either data or password
export const updateSettings = async (data, type) => {
    try {

        const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
        const res = await axios({
            methos: 'PATCH',
            url,
            data
        })

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()}data updates successfully!`)
        }
    } catch (err) {
        showAlert('error', err.respoomse.data.message);
    }
}