import { createElementWithProperties } from '../../utils/utils';
import { ButtonCheckStates } from '../../types/enums';

export class ButtonCheck {
  public state: ButtonCheckStates;
  private element: HTMLButtonElement;
  public isDisable: boolean;

  constructor() {
    // this.state = ButtonCheckStates.check;
    this.createNode();
    // this.isDisable = true;
  }

  private createNode(): void {
    // this.element = createElementWithProperties('button', 'btn btn-active', { type: 'button', disabled: 'disabled' }, [
    //   { innerText: ButtonCheckStates.check },
    // ]);
    this.element = createElementWithProperties('button', 'btn btn-active', { type: 'button' }, [
      { innerText: ButtonCheckStates.check },
    ]);
    this.element.addEventListener('animationend', () => this.element.classList.remove('btn-active'));
  }

  public getComponent(): HTMLButtonElement {
    return this.element;
  }

  public enableButton(): void {
    this.element.removeAttribute('disabled');
    this.isDisable = false;
  }

  public disableButton(): void {
    this.element.setAttribute('disabled', 'disabled');
    this.isDisable = true;
  }

  public setCheckState(): void {
    this.element.innerText = ButtonCheckStates.check;
    this.showAnimation();
    this.state = ButtonCheckStates.check;
    this.disableButton();
  }

  public setContinueState(): void {
    this.element.innerText = ButtonCheckStates.continue;
    this.showAnimation();
    this.state = ButtonCheckStates.continue;
  }

  private showAnimation(): void {
    this.element.classList.add('btn-active');
  }
}
