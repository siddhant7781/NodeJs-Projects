import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
    try {
        const res = await axios({
            methos: 'PATCH',
            url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
            data: {
                name,
                email
            }
        })

        if (res.data.status === 'success') {
            showAlert('success', 'data updates successfully!')
        }
    } catch (err) {
        showAlert('error', err.respoomse.data.message);
    }
}