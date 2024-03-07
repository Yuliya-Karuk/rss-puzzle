import { App } from './app/app';
import './styles/style.css';
import { isNotNullable } from './utils/utils';

const body = isNotNullable(document.querySelector('body'));
const app = new App(body);
app.createStartPage();
// app.createLoginPage();
