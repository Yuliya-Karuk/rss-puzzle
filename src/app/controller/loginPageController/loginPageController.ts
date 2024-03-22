import { UserData } from '../../../types/interfaces';
import { validationFunctions } from '../../../utils/constants';
import { isNotNullable } from '../../../utils/utils';
import { LoginPageView } from '../../view/loginPageView/loginPageView';

export class LoginPageController {
  public view: LoginPageView;

  constructor() {
    this.view = new LoginPageView();
    this.bindViewListeners();
  }

  public createLoginPage(): HTMLDivElement {
    return this.view.getLoginPage();
  }

  private bindViewListeners(): void {
    this.view.loginForm.nameInput.addEventListener('input', () =>
      this.validateLoginInput(this.view.loginForm.nameInput)
    );

    this.view.loginForm.surnameInput.addEventListener('input', () =>
      this.validateLoginInput(this.view.loginForm.surnameInput)
    );
  }

  private validateLoginInput(input: HTMLInputElement): void {
    const errorSpan = isNotNullable(input.nextSibling);
    const inputName = input.id;
    errorSpan.textContent = '';

    for (let i = 0; i < validationFunctions.length; i += 1) {
      errorSpan.textContent += validationFunctions[i](input, inputName);
    }

    this.checkFormValidity();
  }

  private checkFormValidity(): void {
    if (this.view.loginForm.nameInput.checkValidity() && this.view.loginForm.surnameInput.checkValidity()) {
      this.view.loginForm.loginButton.removeAttribute('disabled');
    } else {
      this.view.loginForm.loginButton.setAttribute('disabled', 'disabled');
    }
  }

  public getInputsValues(): UserData {
    const name = this.view.loginForm.nameInput.value;
    const surname = this.view.loginForm.surnameInput.value;
    return { name, surname };
  }
}
