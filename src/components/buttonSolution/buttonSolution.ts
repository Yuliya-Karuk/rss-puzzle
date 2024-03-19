import { ButtonSolutionStates } from '../../types/enums';
import { createElementWithProperties } from '../../utils/utils';
import styles from './buttonSolution.module.scss';

export class ButtonSolution {
  public state: ButtonSolutionStates;
  private element: HTMLButtonElement;
  public isDisable: boolean;

  constructor() {
    this.createNode();
  }

  private createNode(): void {
    this.element = createElementWithProperties('button', 'btn btn-active', { type: 'button' }, [
      { innerText: this.state },
    ]);
    this.element.addEventListener('animationend', () => this.element.classList.remove('btn-active'));
    this.element.addEventListener('pointerup', () => this.showAnimation());
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

  public setSolutionState(): void {
    this.element.innerText = ButtonSolutionStates.solution;
    this.showAnimation();
    this.element.classList.remove(styles.buttonResults);
    this.state = ButtonSolutionStates.solution;
  }

  public setResultsState(): void {
    this.element.innerText = ButtonSolutionStates.results;
    this.showAnimation();
    this.element.classList.add(styles.buttonResults);
    this.state = ButtonSolutionStates.results;
  }
}
