import { Word } from '../../../components/word/word';
import { isNotNullable } from '../../../utils/utils';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { type ButtonsController } from './buttonsController';
import { ReplaceController } from './replaceController';

export function findReplacedElement(touch: Touch): Element[] {
  const x = touch.clientX;
  const y = touch.clientY;

  const elementsUnderTouch = document.elementsFromPoint(x, y);
  return elementsUnderTouch;
}

export class TouchController {
  private view: GamePageView;
  private buttonsController: ButtonsController;
  private replaceController: ReplaceController;
  private isDraggingStart: boolean;

  constructor(view: GamePageView, replaceController: ReplaceController) {
    this.view = view;
    this.replaceController = replaceController;
    this.isDraggingStart = true;
  }

  public bindTouchListeners(): void {
    this.view.wordsRightOrder.forEach(word =>
      word.getComponent().addEventListener('touchmove', (e: TouchEvent) => this.handleTouchMove(e, word))
    );

    this.view.wordsRightOrder.forEach(word =>
      word.getComponent().addEventListener('touchstart', (e: TouchEvent) => this.handleTouchStart(e))
    );

    document.addEventListener('touchend', (e: TouchEvent) => this.handleTouchEnd(e));
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
  }

  private handleTouchMove(e: TouchEvent, word: Word): void {
    if (this.isDraggingStart) {
      word.makeWordDraggableByTouch();
      document.body.append(word.getComponent());
      this.isDraggingStart = false;
    }
    e.preventDefault();
    const dragItem = word.getComponent();
    const touch = e.touches[0];

    const styles = {
      left: `${touch.pageX - dragItem.offsetWidth / 2}px`,
      top: `${touch.pageY - dragItem.offsetHeight / 2}px`,
    };

    Object.assign(dragItem.style, styles);
  }

  private handleTouchEnd(e: TouchEvent): void {
    this.isDraggingStart = true;
    e.preventDefault();

    let replacedEl: Element;
    const elementsUnderTouch = findReplacedElement(e.changedTouches[0]);
    const wordEl = isNotNullable(e.target);

    const replacedIsPlaceholder = Boolean(elementsUnderTouch.find(el => el.classList.contains('placeholder')));

    if (replacedIsPlaceholder) {
      replacedEl = isNotNullable(elementsUnderTouch.find(el => el.classList.contains('placeholder')));

      this.handleReplacePlaceholder(wordEl, replacedEl);
    }
  }

  private handleReplacePlaceholder(wordEl: EventTarget, replacedEl: Element): void {
    const dragWordsInResults = isNotNullable(replacedEl.parentElement).classList.contains('game-results-row');
    const dragWordsInSource = isNotNullable(replacedEl.parentElement).classList.contains('words');

    if (dragWordsInResults) {
      const word = this.view.words.find(el => el.getComponent() === wordEl) as Word;
      const wordIndex = this.view.words.findIndex(el => el.getComponent() === wordEl);
      word.clearWordDraggableByTouch();

      this.dragToResult(replacedEl, word, wordIndex);
    }

    if (dragWordsInSource) {
      const word = this.view.resultWords.find(el => el.getComponent() === wordEl) as Word;
      const wordIndex = this.view.resultWords.findIndex(el => el.getComponent() === wordEl);
      word.clearWordDraggableByTouch();

      this.dragToSource(replacedEl, word, wordIndex);
    }
  }

  private dragToResult(placeholderEl: Element, word: Word, wordIndex: number): void {
    const placeholderIndex = this.view.resultWords.findIndex(el => el.getComponent() === placeholderEl);
    const placeholder = this.view.resultWords[placeholderIndex];

    this.replaceController.replacePlaceholderInResults(word, wordIndex, placeholder, placeholderIndex);
  }

  private dragToSource(placeholderEl: Element, word: Word, wordIndex: number): void {
    const placeholder = isNotNullable(this.view.words.find(el => el.getComponent() === placeholderEl));
    const placeholderIndex = this.view.words.findIndex(el => el === placeholder);

    this.replaceController.replacePlaceholderInSource(word, wordIndex, placeholder, placeholderIndex);
  }
}
