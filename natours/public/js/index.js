import { login, logout } from './login';
import '@babel/polyfill';

const loginForm = document.querySelector('.form');
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

const logOutBtn = document.querySelector('.nav__el--logout');

if (loginForm) {

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        login(email, password);
    });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);