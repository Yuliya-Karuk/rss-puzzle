import { DomElementAttribute } from '../../types/interfaces';
import { createElementWithProperties } from '../../utils/utils';
import styles from './loginForm.module.scss';

type Inputs = 'name' | 'surname';

const LoginInputs: Record<Inputs, DomElementAttribute> = {
  name: {
    id: 'name',
    type: 'text',
    name: 'first-name',
    required: 'required',
    minlength: '3',
    pattern: '^[A-Z][a-zA-Z\\-]+$',
  },
  surname: {
    id: 'surname',
    type: 'text',
    name: 'last-name',
    required: 'required',
    minlength: '4',
    pattern: '^[A-Z][a-zA-Z\\-]+$',
  },
};

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
    this.nameInput = createElementWithProperties('input', styles.loginInput, LoginInputs.name);
    this.surnameInput = createElementWithProperties('input', styles.loginInput, LoginInputs.surname);
    const nameLabel = createElementWithProperties('label', styles.loginLabel, { for: 'name' }, [
      { innerText: `First name` },
    ]);
    const surnameLabel = createElementWithProperties('label', styles.loginLabel, { for: 'surname' }, [
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
