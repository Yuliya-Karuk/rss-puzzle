import { Word } from '../../../components/word/word';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { checkEventTarget, isNotNullable } from '../../../utils/utils';
import { DragState } from '../../../types/enums';
import { type ButtonsController } from './buttonsController';
import { Placeholder } from '../../../components/placeholder/placeholder';
import { ReplaceController } from './replaceController';

export class DragController {
  private view: GamePageView;
  private buttonsController: ButtonsController;
  private replaceController: ReplaceController;

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
  }

  private handleForbiddenDrag(e: DragEvent): void {
    const wordId = isNotNullable(e.dataTransfer).getData('text');
    const word = isNotNullable(this.view.wordsRightOrder.find(el => el.id === wordId));
    word.removeDragStyle();
  }

  public bindDragListeners(): void {
    this.view.resultRow.addEventListener('dragover', (e: DragEvent) => this.handleDragOver(e));

    this.view.resultRow.addEventListener('drop', (e: DragEvent) => this.handleDragEnd(e, DragState.toResults));

    this.view.sourceElement.addEventListener('dragover', e => {
      this.handleDragOver(e as DragEvent);
    });

    this.view.sourceElement.addEventListener('drop', e => {
      this.handleDragEnd(e as DragEvent, DragState.toSource);
    });
  }

  private handleDragOver(e: DragEvent): void {
    e.preventDefault();
    isNotNullable(e.dataTransfer).dropEffect = 'move';
  }

  private handleDragEnd(e: DragEvent, dragState: DragState): void {
    const wordId = isNotNullable(e.dataTransfer).getData('text');
    const word = isNotNullable(this.view.wordsRightOrder.find(el => el.id === wordId));
    const dragWordsInSource = isNotNullable(word.getComponent().parentElement).classList.contains('words');
    const dragWordsInResults = isNotNullable(word.getComponent().parentElement).classList.contains('game-results-row');

    if (dragState === DragState.toResults && !dragWordsInResults) {
      this.dragToResult(word, checkEventTarget(e.target), e);
    } else if (dragState === DragState.toResults && dragWordsInResults) {
      this.dragInResult(word, checkEventTarget(e.target), e);
    } else if (dragState === DragState.toSource && !dragWordsInSource) {
      this.dragToSource(word, checkEventTarget(e.target));
    }

    this.buttonsController.setStateCheckButton();
    word.removeDragStyle();
  }

  public dragToResult(word: Word, replacedElement: HTMLElement, e: DragEvent): void {
    const replacedComponent = isNotNullable(this.view.resultWords.find(el => el.getComponent() === replacedElement));
    const componentIndex = this.view.resultWords.findIndex(el => el === replacedComponent);
    const wordIndex = this.view.words.findIndex(el => el === word);

    if (replacedComponent instanceof Placeholder) {
      this.replaceController.replacePlaceholderInResults(word, wordIndex, replacedComponent, componentIndex);
    } else {
      this.replaceController.moveWordWithReplaceLastPlaceholder(e, word, wordIndex, replacedComponent, componentIndex);
    }
  }

  public dragToSource(word: Word, replacedElement: HTMLElement): void {
    const placeholder = isNotNullable(this.view.words.find(el => el.getComponent() === replacedElement));
    const placeholderIndex = this.view.words.findIndex(el => el === placeholder);
    const wordIndex = this.view.resultWords.findIndex(el => el === word);

    this.replaceController.replacePlaceholderInSource(word, wordIndex, placeholder, placeholderIndex);
  }

  private dragInResult(word: Word, replacedElement: HTMLElement, e: DragEvent): void {
    this.replaceController.moveWordsInResults(word, replacedElement, e);
  }
}
