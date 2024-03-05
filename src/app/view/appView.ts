import { LoginPageView } from './loginPageView/loginPageView';

export class AppView {
  public loginPageView: LoginPageView;

  constructor() {
    this.loginPageView = new LoginPageView();
  }

  public createLoginPage(): HTMLDivElement {
    return this.loginPageView.getLoginPage();
  }
}
