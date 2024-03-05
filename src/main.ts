import { AppView } from './app/view/appView';
import './styles/style.css';

const app = new AppView();
document.querySelector('body')?.append(app.createLoginPage());
