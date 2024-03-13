import { createElementWithProperties, isNotNullable } from '../../utils/utils';
import styles from './word.module.scss';

export class Word {
  public element: HTMLDivElement;
  public isGuessed: boolean;
  public value: string;
  public id: string;

  constructor(word: string, id: string) {
    this.value = word;
    this.id = id;
    this.element = createElementWithProperties('div', styles.word, { draggable: 'true', id: this.id }, [
      { innerHTML: this.value },
    ]);
    this.isGuessed = false;
    this.element.addEventListener('dragstart', (e: DragEvent) => this.handleDragStart(e));
  }

  public checkState(state: boolean): void {
    this.isGuessed = state;
    if (this.isGuessed) {
      this.element.classList.add(`${styles.word}_valid`);
    } else {
      this.element.classList.add(`${styles.word}_invalid`);
    }
  }

  public removeState(): void {
    this.element.classList.remove(`${styles.word}_invalid`);
    this.element.classList.remove(`${styles.word}_valid`);
  }

  public getComponent(): HTMLDivElement {
    return this.element;
  }

  private handleDragStart(e: DragEvent): void {
    if (e.target instanceof HTMLElement) {
      isNotNullable(e.dataTransfer).setData('text', isNotNullable(e.target).id);
      isNotNullable(e.dataTransfer).dropEffect = 'move';
      e.target.classList.add('drag');
    }
  }

  public removeDragStyle(): void {
    this.element.classList.remove('drag');
  }
}
