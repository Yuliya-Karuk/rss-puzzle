import { createElementWithProperties } from '../../../utils/utils';
import styles from './loginPageView.module.scss';
import { LoginForm } from '../../../components/loginForm/loginForm';
import loginImagePath from '../../../img/login_image.png';

export class LoginPageView {
  public loginForm: LoginForm;

  constructor() {
    this.loginForm = new LoginForm();
  }

  public getLoginPage(): HTMLDivElement {
    const container = createElementWithProperties('div', styles.page);
    const loginImageContainer = createElementWithProperties('div', styles.loginImageContainer);
    const loginImage = createElementWithProperties('img', styles.loginImage, {
      alt: 'login image',
      src: `${loginImagePath}`,
    });
    loginImageContainer.append(loginImage);
    container.append(this.loginForm.getComponent(), loginImageContainer);
    return container;
  }
}
