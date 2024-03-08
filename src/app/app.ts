import { StorageService } from '../services/localStorage.service';
import { isNotNullable } from '../utils/utils';
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
    this.bindStartPageListeners();
    this.parentElement.append(this.appController.getHeader(), component, this.appController.getFooter());
    const userData = isNotNullable(StorageService.getData());
    this.appController.setGreetingUser(`Hi, ${userData.name} ${userData.surname}`);
  }

  private bindLoginPageListeners(): void {
    this.loginPageController.view.loginForm.element.addEventListener('submit', e => this.loginUser(e));
  }

  private bindStartPageListeners(): void {
    this.appController.header.logoutButton.addEventListener('click', () => this.logoutUser());
    this.appController.startPageController.view.startButton.addEventListener('click', () => this.createGamePage());
  }

  private loginUser(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    const userData = this.loginPageController.getInputsValues();
    StorageService.saveData(userData);
    this.clearParentElement();
    this.createStartPage();
  }

  private logoutUser(): void {
    StorageService.removeData();
    this.clearParentElement();
    this.createLoginPage();
  }

  private clearParentElement(): void {
    this.parentElement.replaceChildren();
  }

  public checkIsUserLogin(): boolean {
    return !!StorageService.getData();
  }

  public createGamePage(): void {
    this.clearParentElement();
  }
}
