import { Placeholder } from '../../../components/placeholder/placeholder';
import { Word } from '../../../components/word/word';
import { DragStartPlace, DragState } from '../../../types/enums';
import { checkEventTarget, isNotNullable } from '../../../utils/utils';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { type ButtonsController } from './buttonsController';
import { ReplaceController } from './replaceController';

export class DragController {
  private view: GamePageView;
  private buttonsController: ButtonsController;
  private replaceController: ReplaceController;
  private dragWord: Word;
  private wordStartPlace: DragStartPlace;
  private replacedEl: HTMLElement;

  constructor(view: GamePageView, buttonsController: ButtonsController, replaceController: ReplaceController) {
    this.view = view;
    this.buttonsController = buttonsController;
    this.replaceController = replaceController;
  }

  public bindStaticListeners(): void {
    this.view.getGamePage().addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
    });
    this.view.getGamePage().addEventListener('drop', (e: DragEvent) => this.handleForbiddenDrag(e));
    this.view.sourceElement.addEventListener('dragover', (e: DragEvent) => this.handleDragOver(e));
    this.view.sourceElement.addEventListener('drop', (e: DragEvent) => this.handleDragEnd(e, DragState.toSource));
  }

  private handleForbiddenDrag(e: DragEvent): void {
    const wordId = isNotNullable(e.dataTransfer).getData('text');
    const word = isNotNullable(this.view.wordsRightOrder.find(el => el.id === wordId));
    word.removeDragStyle();
  }

  public bindDragListeners(): void {
    this.view.resultRow.addEventListener('dragover', (e: DragEvent) => this.handleDragOver(e));

    this.view.resultRow.addEventListener('drop', (e: DragEvent) => this.handleDragEnd(e, DragState.toResults));
  }

  public handleDragOver(e: DragEvent): void {
    e.preventDefault();
    isNotNullable(e.dataTransfer).dropEffect = 'move';
  }

  private findStartWordPlace(): void {
    if (isNotNullable(this.dragWord.getComponent().parentElement).classList.contains('words')) {
      this.wordStartPlace = DragStartPlace.source;
    } else {
      this.wordStartPlace = DragStartPlace.results;
    }
  }

  public handleDragEnd(e: DragEvent, dragState: DragState): void {
    e.preventDefault();

    const wordId = isNotNullable(e.dataTransfer).getData('text');
    this.dragWord = isNotNullable(this.view.wordsRightOrder.find(el => el.id === wordId));
    this.replacedEl = checkEventTarget(e.target);
    this.findStartWordPlace();

    if (dragState === DragState.toResults && this.wordStartPlace === DragStartPlace.source) {
      this.dragToResult(e);
    }
    if (dragState === DragState.toResults && this.wordStartPlace === DragStartPlace.results) {
      this.dragInResult(e);
    }
    if (dragState === DragState.toSource && this.wordStartPlace === DragStartPlace.source) {
      this.dragToSource();
    }

    this.buttonsController.setStateCheckButton();
    this.dragWord.removeDragStyle();
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
