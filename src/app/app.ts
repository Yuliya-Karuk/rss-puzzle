import { LoginPageController } from './controller/loginPageController/loginPageController';

export class App {
  public loginPageController: LoginPageController;

  constructor() {
    this.loginPageController = new LoginPageController();
  }

  public createLoginPage(): HTMLDivElement {
    return this.loginPageController.createLoginPage();
  }
}
