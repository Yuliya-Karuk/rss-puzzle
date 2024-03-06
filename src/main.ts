import { App } from './app/app';
import './styles/style.css';

const app = new App();
document.querySelector('body')?.append(app.createLoginPage());
