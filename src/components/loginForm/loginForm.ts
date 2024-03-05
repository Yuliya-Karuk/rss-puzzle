import { createElementWithProperties } from '../../utils/utils';
import styles from './loginForm.module.scss';

export class LoginForm {
  public nameInput: HTMLInputElement;
  public surnameInput: HTMLInputElement;
  public loginForm: HTMLFormElement;
  public nameError: HTMLSpanElement;
  public surnameError: HTMLSpanElement;
  public loginButton: HTMLButtonElement;

  constructor() {
    this.loginForm = createElementWithProperties('form', styles.login, { novalidate: 'novalidate' });
    this.createChildren();
  }

  private createChildren(): void {
    this.nameInput = createElementWithProperties('input', styles.loginInput, {
      id: 'first-name',
      type: 'text',
      name: 'first-name',
      required: 'required',
    });
    this.surnameInput = createElementWithProperties('input', styles.loginInput, {
      id: 'last-name',
      type: 'text',
      name: 'last-name',
      required: 'required',
    });
    const nameLabel = createElementWithProperties('label', styles.loginLabel, { for: 'first-name' }, [
      { innerText: `First name` },
    ]);
    const surnameLabel = createElementWithProperties('label', styles.loginLabel, { for: 'last-name' }, [
      { innerText: `Last name` },
    ]);
    this.nameError = createElementWithProperties('span', styles.loginError);
    this.surnameError = createElementWithProperties('span', styles.loginError);
    const title = createElementWithProperties('h2', styles.loginTitle, undefined, [{ innerText: `Login` }]);
    this.loginButton = createElementWithProperties(
      'button',
      styles.loginButton,
      { type: 'submit', disabled: 'disabled' },
      [{ innerText: `Login` }]
    );
    this.loginForm.append(
      title,
      nameLabel,
      this.nameInput,
      this.nameError,
      surnameLabel,
      this.surnameInput,
      this.surnameError,
      this.loginButton
    );
  }

  public getComponent(): HTMLFormElement {
    return this.loginForm;
  }
}
