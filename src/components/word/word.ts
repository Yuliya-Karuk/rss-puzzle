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

  public changeState(): void {
    this.isGuessed = !this.isGuessed;
  }

  public getComponent(): HTMLDivElement {
    return this.element;
  }
}
