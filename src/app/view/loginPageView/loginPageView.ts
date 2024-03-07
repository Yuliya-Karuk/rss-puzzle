import { createElementWithProperties } from '../../../utils/utils';
import styles from './loginPageView.module.scss';
import { LoginForm } from '../../../components/loginForm/loginForm';
import loginImagePath from '../../../img/login_image.png';

export class LoginPageView {
  public loginForm: LoginForm;
  public element: HTMLDivElement;

  constructor() {
    this.element = createElementWithProperties('div', styles.page);
    this.loginForm = new LoginForm();
    this.createChildren();
  }

  private createChildren(): void {
    const loginImageContainer = createElementWithProperties('div', styles.loginImageContainer);
    const loginImage = createElementWithProperties('img', styles.loginImage, {
      alt: 'login image',
      src: `${loginImagePath}`,
    });
    loginImageContainer.append(loginImage);
    this.element.append(this.loginForm.getComponent(), loginImageContainer);
  }

  public getLoginPage(): HTMLDivElement {
    this.loginForm.nameInput.value = '';
    this.loginForm.surnameInput.value = '';
    return this.element;
  }
}
