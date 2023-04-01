import { login, logout } from './login';
import '@babel/polyfill';
import { updateData } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const email = document.getElementById('email');
const password = document.getElementById('password');

const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form--user--data')

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
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateData(name, email);
    })
}