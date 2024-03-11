import { createElementWithProperties } from '../../utils/utils';
import styles from './buttonCheck.module.scss';
import { ButtonState } from '../../types/enums';

export class ButtonCheck {
  public state: ButtonState;
  private element: HTMLButtonElement;
  public isDisable: boolean;

  constructor() {
    this.state = ButtonState.check;
    this.createNode();
    this.isDisable = true;
  }

  private createNode(): void {
    this.element = createElementWithProperties(
      'button',
      `btn ${styles.btnActive}`,
      { type: 'button', disabled: 'disabled' },
      [{ innerText: ButtonState.check }]
    );
    this.element.addEventListener('animationend', () => this.element.classList.remove('btn-active'));
  }

  public getComponent(): HTMLButtonElement {
    return this.element;
  }

  public enableCheckButton(): void {
    this.element.removeAttribute('disabled');
    this.isDisable = false;
  }

  public disableCheckButton(): void {
    this.element.setAttribute('disabled', 'disabled');
    this.isDisable = true;
  }

  public setCheckState(): void {
    this.element.innerText = ButtonState.check;
    this.showAnimation();
    this.state = ButtonState.check;
    this.disableCheckButton();
  }

  public setContinueState(): void {
    this.element.innerText = ButtonState.continue;
    this.showAnimation();
    this.state = ButtonState.continue;
  }

  private showAnimation(): void {
    this.element.classList.add('btn-active');
  }
}
