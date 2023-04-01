import { login } from './login';
import '@babel/polyfill';

const loginForm = document.querySelector('.form');
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

if (loginForm) {

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        login(email, password);
    });
}
