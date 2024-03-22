import { Word } from '../../../components/word/word';
import { DragStartPlace, ReplacedComponent, ReplacedPlace } from '../../../types/enums';
import { checkElement, checkEventTarget, findElementsUnderTouch, isNotNullable } from '../../../utils/utils';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { type ButtonsController } from './buttonsController';
import { ReplaceController } from './replaceController';

export class TouchController {
  private view: GamePageView;
  private replaceController: ReplaceController;
  private buttonsController: ButtonsController;
  private isDraggingStart: boolean;
  private touch: Touch;
  private wordStartPlace: DragStartPlace;
  private wordIndex: number;
  private dragWord: Word;
  private replacedEl: HTMLElement;
  private replacedType: ReplacedComponent;
  private replacedPlace: ReplacedPlace;
  private isForbidden: boolean;

  constructor(view: GamePageView, buttonsController: ButtonsController, replaceController: ReplaceController) {
    this.isDraggingStart = true;
    this.view = view;
    this.replaceController = replaceController;
    this.buttonsController = buttonsController;
    this.bindStartListeners();
  }

  private bindStartListeners(): void {
    document.addEventListener('touchend', (e: TouchEvent) => this.handleTouchEnd(e));
  }

  public bindTouchListeners(): void {
    this.view.wordsRightOrder.forEach(word => {
      word.getComponent().addEventListener('touchstart', (e: TouchEvent) => this.handleTouchStart(e));
      word.getComponent().addEventListener('touchmove', (e: TouchEvent) => this.handleTouchMove(e, word));
    });
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
  }

  private handleTouchMove(e: TouchEvent, word: Word): void {
    e.preventDefault();

    if (this.isDraggingStart) {
      this.findStartWordPlace(word);

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

  private findStartWordPlace(word: Word): void {
    this.dragWord = word;

    if (this.view.resultWords.includes(word)) {
      this.wordStartPlace = DragStartPlace.results;
      this.wordIndex = this.view.resultWords.findIndex(el => el === word);
    } else {
      this.wordStartPlace = DragStartPlace.source;
      this.wordIndex = this.view.words.findIndex(el => el === word);
    }
  }

  private findReplacedEl(elementsUnderTouch: Element[]): void {
    this.isForbidden = false;

    const isPlaceholder = elementsUnderTouch.find(el => el.classList.contains('placeholder'));
    const isWord = elementsUnderTouch.find(
      el => el.classList.contains('word-container') && el !== this.dragWord.getComponent()
    );

    if (isPlaceholder) {
      this.replacedEl = checkElement(elementsUnderTouch.find(el => el.classList.contains('placeholder')));
      this.replacedType = ReplacedComponent.placeholder;
    } else if (isWord) {
      this.replacedEl = checkElement(
        elementsUnderTouch.find(el => el.classList.contains('word-container') && el !== this.dragWord.getComponent())
      );

      this.replacedType = ReplacedComponent.word;
    } else {
      this.isForbidden = true;
      return;
    }

    this.findReplacedElPlace();
  }

  private findReplacedElPlace(): void {
    const replacedInResults = isNotNullable(this.replacedEl.parentElement).classList.contains('game-results-row');

    if (replacedInResults) {
      this.replacedPlace = ReplacedPlace.results;
    } else {
      this.replacedPlace = ReplacedPlace.source;

      if (this.replacedType === ReplacedComponent.word) {
        this.isForbidden = true;
      }

      if (this.replacedType === ReplacedComponent.placeholder && this.wordStartPlace === DragStartPlace.source) {
        this.isForbidden = true;
      }
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    this.isDraggingStart = true;
    e.preventDefault();

    if (!checkEventTarget(e.target).classList.contains('word-container')) {
      return;
    }

    const elementsUnderTouch = findElementsUnderTouch(e.changedTouches[0]);
    this.findReplacedEl(elementsUnderTouch);

    if (this.isForbidden) {
      this.handleForbiddenDrag();
      return;
    }

    if (this.replacedType === ReplacedComponent.placeholder) {
      this.handleReplacePlaceholder();
    } else {
      this.handleReplaceWord();
    }

    this.dragWord.clearWordDraggableByTouch();
    this.buttonsController.setStateCheckButton();
  }

  private handleReplacePlaceholder(): void {
    if (this.replacedPlace === ReplacedPlace.source) {
      this.dragToSource(this.replacedEl, this.dragWord, this.wordIndex);
    }

    if (this.replacedPlace === ReplacedPlace.results) {
      if (this.wordStartPlace === DragStartPlace.source) {
        this.dragToResult(this.replacedEl, this.dragWord, this.wordIndex);
      } else {
        this.replaceController.moveWordsInResults(this.dragWord, this.replacedEl, this.touch);
      }
    }
  }

  private handleReplaceWord(): void {
    if (this.wordStartPlace === DragStartPlace.source) {
      const replacedComponent = isNotNullable(
        this.view.resultWords.find(el => el.getComponent() === this.replacedEl)
      ) as Word;

      const componentIndex = this.view.resultWords.findIndex(el => el === replacedComponent);

      this.replaceController.moveWordWithReplaceLastPlaceholder(
        this.touch,
        this.dragWord,
        this.wordIndex,
        replacedComponent,
        componentIndex
      );
    }

    if (this.wordStartPlace === DragStartPlace.results) {
      this.replaceController.moveWordsInResults(this.dragWord, this.replacedEl, this.touch);
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

  private handleForbiddenDrag(): void {
    if (this.wordStartPlace === DragStartPlace.source) {
      this.view.sourceElement.children[this.wordIndex].before(this.dragWord.getComponent());
    } else {
      this.view.resultRow.children[this.wordIndex].before(this.dragWord.getComponent());
    }
    isNotNullable(this.dragWord).clearWordDraggableByTouch();
  }
}
