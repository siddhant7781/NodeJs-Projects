import { login, logout } from './login';
import '@babel/polyfill';
import { updateSettings } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const email = document.getElementById('email');
const password = document.getElementById('password');

const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form--user--data')
const userPasswordForm = document.querySelector('.form--user--password')
if (loginForm) {

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('pfoto').files[0]);
        updateSettings(form, 'data');
    })
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('btn--save-password').textContent = 'updating...'
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
    })

    document.querySelector('btn--save-password').value = 'Save password'
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
}