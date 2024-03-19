import { Word } from '../../../components/word/word';
import { checkEventTarget, isNotNullable } from '../../../utils/utils';
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
  private replaceController: ReplaceController;
  private buttonsController: ButtonsController;
  private isDraggingStart: boolean;
  private touch: Touch;

  constructor(view: GamePageView, buttonsController: ButtonsController, replaceController: ReplaceController) {
    this.isDraggingStart = true;
    this.view = view;
    this.replaceController = replaceController;
    this.buttonsController = buttonsController;
  }

  public bindTouchListeners(): void {
    this.view.wordsRightOrder.forEach(word => {
      word.getComponent().addEventListener('touchstart', (e: TouchEvent) => this.handleTouchStart(e));
      word.getComponent().addEventListener('touchmove', (e: TouchEvent) => this.handleTouchMove(e, word));
    });

    document.addEventListener('touchend', (e: TouchEvent) => this.handleTouchEnd(e));
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
  }

  private handleTouchMove(e: TouchEvent, word: Word): void {
    e.preventDefault();

    if (this.isDraggingStart) {
      word.makeWordDraggableByTouch();
      document.body.append(word.getComponent());
      this.isDraggingStart = false;
    }

    const dragItem = word.getComponent();
    const [touch] = e.touches;
    this.touch = touch;

    const styles = {
      left: `${this.touch.pageX - dragItem.offsetWidth / 2}px`,
      top: `${this.touch.pageY - dragItem.offsetHeight / 2}px`,
    };

    word.setContainerStyle(styles);
  }

  private handleTouchEnd(e: TouchEvent): void {
    this.isDraggingStart = true;
    e.preventDefault();

    let replacedEl: Element;
    const elementsUnderTouch = findReplacedElement(e.changedTouches[0]);
    const wordEl = isNotNullable(e.target);

    if (!checkEventTarget(wordEl).classList.contains('word-container')) {
      return;
    }

    if (this.checkIsOut(elementsUnderTouch)) {
      this.handleForbiddenDrag(wordEl);
      return;
    }

    const replacedIsPlaceholder = Boolean(elementsUnderTouch.find(el => el.classList.contains('placeholder')));
    const replacedIsWord = Boolean(
      elementsUnderTouch.find(el => el.classList.contains('word-container') && el !== wordEl)
    );

    if (replacedIsPlaceholder) {
      replacedEl = isNotNullable(elementsUnderTouch.find(el => el.classList.contains('placeholder')));

      this.handleReplacePlaceholder(wordEl, replacedEl);
    }
    if (replacedIsWord) {
      replacedEl = isNotNullable(
        elementsUnderTouch.find(el => el.classList.contains('word-container') && el !== wordEl)
      );

      this.handleReplaceWord(wordEl, replacedEl);
    }

    this.buttonsController.setStateCheckButton();
  }

  private handleReplacePlaceholder(wordEl: EventTarget, replacedEl: Element): void {
    const dragWordsInResults = isNotNullable(replacedEl.parentElement).classList.contains('game-results-row');
    const dragWordsInSource = isNotNullable(replacedEl.parentElement).classList.contains('words');

    if (dragWordsInResults) {
      const wordElFromSource = this.view.words.findIndex(el => el.getComponent() === wordEl);

      if (wordElFromSource !== -1) {
        const word = this.view.words.find(el => el.getComponent() === wordEl) as Word;
        const wordIndex = this.view.words.findIndex(el => el.getComponent() === wordEl);
        word.clearWordDraggableByTouch();

        this.dragToResult(replacedEl, word, wordIndex);
      } else {
        const word = this.view.resultWords.find(el => el.getComponent() === wordEl) as Word;
        word.clearWordDraggableByTouch();

        this.replaceController.moveWordsInResults(word, replacedEl as HTMLElement, this.touch);
      }
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

  private handleReplaceWord(wordEl: EventTarget, replacedEl: Element): void {
    const wordElFromSource = this.view.sourceElement.children.length === 7;

    const replacedComponent = isNotNullable(this.view.resultWords.find(el => el.getComponent() === replacedEl)) as Word;
    const componentIndex = this.view.resultWords.findIndex(el => el === replacedComponent);

    if (wordElFromSource) {
      const word = this.view.words.find(el => el.getComponent() === wordEl) as Word;
      const wordIndex = this.view.words.findIndex(el => el.getComponent() === wordEl);
      word.clearWordDraggableByTouch();

      this.replaceController.moveWordWithReplaceLastPlaceholder(
        this.touch,
        word,
        wordIndex,
        replacedComponent,
        componentIndex
      );
    } else {
      const word = this.view.resultWords.find(el => el.getComponent() === wordEl) as Word;
      word.clearWordDraggableByTouch();

      this.replaceController.moveWordsInResults(word, replacedEl as HTMLElement, this.touch);
    }
  }

  private checkIsOut(elementsUnderTouch: Element[]): boolean {
    return !elementsUnderTouch.includes(this.view.resultRow) && !elementsUnderTouch.includes(this.view.sourceElement);
  }

  private handleForbiddenDrag(wordEl: EventTarget): void {
    let word;
    const wordElFromSource = this.view.words.find(el => el.getComponent() === wordEl);
    if (wordElFromSource) {
      this.view.sourceElement.append(checkEventTarget(wordEl));
      word = this.view.words.find(el => el.getComponent() === wordEl) as Word;
    } else {
      this.view.resultRow.append(checkEventTarget(wordEl));
      word = this.view.resultWords.find(el => el.getComponent() === wordEl) as Word;
    }
    isNotNullable(word).clearWordDraggableByTouch();
  }
}
