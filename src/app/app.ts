import { StorageService } from '../services/storage.service';
import { defaultCompletedRounds, defaultHintsState, defaultLastRound } from '../utils/constants';
import { isNotNullable } from '../utils/utils';
import { AppController } from './controller/appController';
import { LoginPageController } from './controller/loginPageController/loginPageController';

export class App {
  public loginPageController: LoginPageController;
  public appController: AppController;
  public parentElement: HTMLBodyElement;

  constructor() {
    this.parentElement = isNotNullable(document.querySelector('body'));
    this.loginPageController = new LoginPageController();
    this.appController = new AppController();
  }

  public chooseFirstPage(): void {
    if (this.checkIsUserLogin()) {
      this.createStartPage();
    } else {
      this.createLoginPage();
    }
  }

  public createLoginPage(): void {
    const component = this.loginPageController.createLoginPage();

    this.bindLoginPageListeners();
    this.parentElement.append(component);
  }

  public createStartPage(): void {
    const component = this.appController.getStartPage();
    const userData = isNotNullable(StorageService.getUserData());

    this.parentElement.append(this.appController.getHeader(), component, this.appController.getFooter());
    this.appController.setGreetingUser(`Hi, ${userData.name} ${userData.surname}`);

    this.bindStartPageListeners();
  }

  private bindLoginPageListeners(): void {
    this.loginPageController.view.loginForm.element.addEventListener('submit', e => this.loginUser(e));
  }

  private bindStartPageListeners(): void {
    this.appController.header.logoutButton.addEventListener('pointerup', () => this.logoutUser());

    this.appController.startPageController.view.startButton.addEventListener('pointerup', () => this.createGamePage());
  }

  private loginUser(e: Event): void {
    e.stopPropagation();
    e.preventDefault();

    const userData = this.loginPageController.getInputsValues();
    StorageService.saveData(userData, defaultHintsState, defaultCompletedRounds, defaultLastRound);

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
    return !!StorageService.getUserData();
  }

  public createGamePage(): void {
    this.clearParentElement();

    const component = this.appController.getGamePage(this.parentElement);
    this.parentElement.prepend(this.appController.getHeader(), component, this.appController.getFooter());
  }
}
