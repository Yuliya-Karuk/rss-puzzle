import { createElementWithProperties } from '../../utils/utils';
import styles from './word.module.scss';

export class Word {
  public element: HTMLDivElement;
  public isGuessed: boolean;
  public value: string;

  constructor(word: string) {
    this.value = word;
    this.element = createElementWithProperties('div', styles.wordItem, undefined, [{ innerHTML: this.value }]);
    this.isGuessed = false;
  }

  public checkState(state: boolean): void {
    this.isGuessed = state;
    if (this.isGuessed) {
      this.element.classList.add(`${styles.wordItem}_valid`);
    } else {
      this.element.classList.add(`${styles.wordItem}_invalid`);
    }
  }

  public removeState(): void {
    this.element.classList.remove(`${styles.wordItem}_invalid`);
    this.element.classList.remove(`${styles.wordItem}_valid`);
  }

  public getComponent(): HTMLDivElement {
    return this.element;
  }
}
