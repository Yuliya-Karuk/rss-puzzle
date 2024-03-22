import { Placeholder } from '../../../components/placeholder/placeholder';
import { Word } from '../../../components/word/word';
import { DragStartPlace, ReplacedComponent, ReplacedPlace } from '../../../types/enums';
import { checkEventTarget, isNotNullable } from '../../../utils/utils';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { type ButtonsController } from './buttonsController';
import { ReplaceController } from './replaceController';

export class DragController {
  private view: GamePageView;
  private parentEl: HTMLBodyElement;
  private buttonsController: ButtonsController;
  private replaceController: ReplaceController;
  private dragWord: Word;
  private wordStartPlace: DragStartPlace;
  private replacedEl: HTMLElement;
  private replacedPlace: ReplacedPlace;

  constructor(
    view: GamePageView,
    buttonsController: ButtonsController,
    replaceController: ReplaceController,
    parentEl: HTMLBodyElement
  ) {
    this.view = view;
    this.parentEl = parentEl;
    this.buttonsController = buttonsController;
    this.replaceController = replaceController;
  }

  public bindStaticListeners(): void {
    this.parentEl.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
    });
    this.parentEl.addEventListener('drop', (e: DragEvent) => this.handleForbiddenDrag(e));
  }

  private handleForbiddenDrag(e: DragEvent): void {
    const wordId = isNotNullable(e.dataTransfer).getData('text');
    const word = isNotNullable(this.view.wordsRightOrder.find(el => el.id === wordId));
    word.removeDragStyle();
  }

  public bindDragListeners(): void {
    this.view.words.forEach(word => {
      word.getComponent().addEventListener('dragover', (e: DragEvent) => this.handleDragOver(e));
      word.getComponent().addEventListener('drop', (e: DragEvent) => this.handleDrag(e, ReplacedComponent.word));
    });

    this.view.resultWords.forEach(pl => {
      pl.getComponent().addEventListener('dragover', (e: DragEvent) => this.handleDragOver(e));
      pl.getComponent().addEventListener('drop', (e: DragEvent) => this.handleDrag(e, ReplacedComponent.placeholder));
    });
  }

  public handleDragOver(e: DragEvent): void {
    e.preventDefault();
    isNotNullable(e.dataTransfer).dropEffect = 'move';
  }

  private handleDrag(e: DragEvent, replacedComp: ReplacedComponent): void {
    e.preventDefault();

    const wordId = isNotNullable(e.dataTransfer).getData('text');
    this.dragWord = isNotNullable(this.view.wordsRightOrder.find(el => el.id === wordId));
    this.replacedEl = checkEventTarget(e.target);

    this.findStartWordPlace();
    this.findReplacedElPlace();

    if (replacedComp === ReplacedComponent.placeholder) {
      this.handleReplacePlaceholder(e);
    } else {
      this.handleMoveWord(e);
    }

    this.buttonsController.setStateCheckButton();
    this.dragWord.removeDragStyle();
  }

  private findStartWordPlace(): void {
    if (isNotNullable(this.dragWord.getComponent().parentElement).classList.contains('words')) {
      this.wordStartPlace = DragStartPlace.source;
    } else {
      this.wordStartPlace = DragStartPlace.results;
    }
  }

  private findReplacedElPlace(): void {
    const replacedInResults = isNotNullable(this.replacedEl.parentElement).classList.contains('game-results-row');

    if (replacedInResults) {
      this.replacedPlace = ReplacedPlace.results;
    } else {
      this.replacedPlace = ReplacedPlace.source;
    }
  }

  private handleReplacePlaceholder(e: DragEvent): void {
    if (this.replacedPlace === ReplacedPlace.results && this.wordStartPlace === DragStartPlace.source) {
      this.dragToResult(e);
    }

    if (this.replacedPlace === ReplacedPlace.source && this.wordStartPlace === DragStartPlace.results) {
      this.dragToSource();
    }

    if (this.replacedPlace === ReplacedPlace.results && this.wordStartPlace === DragStartPlace.results) {
      this.dragInResult(e);
    }
  }

  private handleMoveWord(e: DragEvent): void {
    if (this.replacedPlace === ReplacedPlace.results && this.wordStartPlace === DragStartPlace.results) {
      this.dragInResult(e);
    }
  }

  public dragToResult(e: DragEvent): void {
    const replacedComp = isNotNullable(this.view.resultWords.find(el => el.getComponent() === this.replacedEl));
    const compIndex = this.view.resultWords.findIndex(el => el === replacedComp);
    const wordIndex = this.view.words.findIndex(el => el === this.dragWord);

    if (replacedComp instanceof Placeholder) {
      this.replaceController.replacePlaceholderInResults(this.dragWord, wordIndex, replacedComp, compIndex);
    } else {
      this.replaceController.moveWordWithReplaceLastPlaceholder(e, this.dragWord, wordIndex, replacedComp, compIndex);
    }
  }

  public dragToSource(): void {
    const placeholder = isNotNullable(this.view.words.find(el => el.getComponent() === this.replacedEl));
    const placeholderIndex = this.view.words.findIndex(el => el === placeholder);
    const wordIndex = this.view.resultWords.findIndex(el => el === this.dragWord);

    this.replaceController.replacePlaceholderInSource(this.dragWord, wordIndex, placeholder, placeholderIndex);
  }

  private dragInResult(e: DragEvent): void {
    this.replaceController.moveWordsInResults(this.dragWord, this.replacedEl, e);
  }
}
