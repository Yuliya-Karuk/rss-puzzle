import { createElementWithProperties, isNotNullable } from '../../utils/utils';
import styles from './word.module.scss';

export class Word {
  public element: HTMLDivElement;
  public isGuessed: boolean;
  public value: string;
  public id: string;
  public elementContainer: HTMLDivElement;
  public helper: HTMLDivElement;

  constructor(word: string, id: string) {
    this.value = word;
    this.id = id;
    this.isGuessed = false;
    this.createComponent();
  }

  private createComponent(): void {
    this.elementContainer = createElementWithProperties('div', styles.wordContainer, {
      draggable: 'true',
      id: this.id,
    });
    this.element = createElementWithProperties('div', styles.word, undefined, [{ innerHTML: this.value }]);
    this.helper = createElementWithProperties('div', styles.helper);

    this.elementContainer.append(this.element, this.helper);
    this.elementContainer.addEventListener('dragstart', (e: DragEvent) => this.handleDragStart(e));
  }

  public checkState(state: boolean): void {
    this.isGuessed = state;
    if (this.isGuessed) {
      this.elementContainer.classList.add(`${styles.wordContainer}_valid`);
    } else {
      this.elementContainer.classList.add(`${styles.wordContainer}_invalid`);
    }
  }

  public removeState(): void {
    this.elementContainer.classList.remove(`${styles.wordContainer}_invalid`);
    this.elementContainer.classList.remove(`${styles.wordContainer}_valid`);
  }

  public getComponent(): HTMLDivElement {
    return this.elementContainer;
  }

  private handleDragStart(e: DragEvent): void {
    if (e.target instanceof HTMLElement) {
      isNotNullable(e.dataTransfer).setData('text', isNotNullable(e.target).id);
      isNotNullable(e.dataTransfer).dropEffect = 'move';
      e.target.classList.add('drag');
    }
  }

  public removeDragStyle(): void {
    this.elementContainer.classList.remove('drag');
  }

  public setFirst(): void {
    this.element.classList.add('word_first');
  }

  public setLast(): void {
    this.element.classList.add('word_last');
  }

  public setElementStyle(inlineStyles: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.element.style, inlineStyles);
  }

  public setContainerStyle(inlineStyles: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.elementContainer.style, inlineStyles);
  }

  public setHelperStyle(inlineStyles: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.helper.style, inlineStyles);
  }

  public showBackground(): void {
    this.element.classList.remove('word_hidden');
    this.helper.classList.remove('helper_hidden');
  }

  public hideBackground(): void {
    this.element.classList.add('word_hidden');
    this.helper.classList.add('helper_hidden');
  }

  public makeWordDraggableByTouch(): void {
    this.elementContainer.classList.add('word-container_touch');
  }

  public clearWordDraggableByTouch(): void {
    this.elementContainer.removeAttribute('style');
    this.elementContainer.classList.remove('word-container_touch');
  }
}
