import { StorageService } from '../../services/localStorage.service';
import { createElementWithProperties } from '../../utils/utils';
import styles from './buttonHint.module.scss';

export class ButtonHint {
  private element: HTMLButtonElement;
  public isEnabled: boolean;
  private hintName: string;

  constructor(hintName: string) {
    this.hintName = hintName;
    this.createNode(this.hintName);
    this.isEnabled = true;
  }

  private createNode(className: string): void {
    const icon = createElementWithProperties('span', `hint-icon`);
    this.element = createElementWithProperties('button', `hint ${styles[className]}`, { type: 'button' });
    this.element.append(icon);
  }

  public getComponent(): HTMLButtonElement {
    return this.element;
  }

  public toggleState(): void {
    this.isEnabled = !this.isEnabled;
    this.element.classList.toggle('hint_disabled');
    this.updateStateInStorage();
  }

  public setState(state: boolean): void {
    this.isEnabled = state;
    if (this.isEnabled) {
      this.element.classList.remove('hint_disabled');
      return;
    }
    this.element.classList.add('hint_disabled');
  }

  private updateStateInStorage(): void {
    StorageService.updateHint(this.hintName, this.isEnabled);
  }
}
