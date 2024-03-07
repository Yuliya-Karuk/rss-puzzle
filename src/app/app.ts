import { AppController } from './controller/appController';
import { LoginPageController } from './controller/loginPageController/loginPageController';

export class App {
  public loginPageController: LoginPageController;
  public appController: AppController;
  public parentElement: HTMLBodyElement;

  constructor(body: HTMLBodyElement) {
    this.parentElement = body;
    this.loginPageController = new LoginPageController();
    this.appController = new AppController();
  }

  public createLoginPage(): void {
    const component = this.loginPageController.createLoginPage();
    this.parentElement.append(component);
  }

  public createStartPage(): void {
    const component = this.appController.getStartPage();
    this.parentElement.append(this.appController.getHeader(), component, this.appController.getFooter());
  }
}
