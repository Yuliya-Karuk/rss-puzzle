import { StorageService } from '../services/localStorage.service';
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
    this.bindLoginPageListeners();
    this.parentElement.append(component);
  }

  public createStartPage(): void {
    const component = this.appController.getStartPage();
    this.parentElement.append(this.appController.getHeader(), component, this.appController.getFooter());
  }

  private bindLoginPageListeners(): void {
    this.loginPageController.view.loginForm.element.addEventListener('submit', e => this.loginUser(e));
  }

  private loginUser(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    const userData = this.loginPageController.getInputsValues();
    StorageService.saveData(userData);
    this.clearParentElement();
    this.createStartPage();
  }

  private clearParentElement(): void {
    this.parentElement.replaceChildren();
  }
}
