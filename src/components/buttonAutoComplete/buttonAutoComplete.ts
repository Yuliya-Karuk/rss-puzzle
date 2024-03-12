import { createElementWithProperties } from '../../utils/utils';

export class ButtonAutoComplete {
  private element: HTMLButtonElement;
  public isDisable: boolean;

  constructor() {
    this.createNode();
    this.isDisable = false;
  }

  private createNode(): void {
    this.element = createElementWithProperties('button', 'btn btn-active', { type: 'button' }, [
      { innerText: 'Auto complete' },
    ]);
    this.element.addEventListener('animationend', () => this.element.classList.remove('btn-active'));
    this.element.addEventListener('click', () => this.showAnimation());
  }

  public getComponent(): HTMLButtonElement {
    return this.element;
  }

  private showAnimation(): void {
    this.element.classList.add('btn-active');
  }

  public enableButton(): void {
    this.element.removeAttribute('disabled');
    this.isDisable = false;
  }

  public disableButton(): void {
    this.element.setAttribute('disabled', 'disabled');
    this.isDisable = true;
  }
}
