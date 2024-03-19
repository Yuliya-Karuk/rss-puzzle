import { UserData } from '../../../types/interfaces';
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
    if (input.validity.tooShort) {
      errorSpan.textContent = `Your ${inputName} should contain minimum ${inputName === 'name' ? 3 : 4} letters. `;
    }
    if (input.validity.patternMismatch) {
      if (input.value[0].toUpperCase() !== input.value[0]) {
        errorSpan.textContent += `Your ${inputName} should start with capital letter. `;
      }
      if (!input.value.match('^[a-zA-Z\\-]+$')) {
        errorSpan.textContent += `Only English letters and “-” are allowed.`;
      }
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
