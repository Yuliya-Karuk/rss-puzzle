import { Word } from '../../../components/word/word';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { checkEventTarget, isNotNullable } from '../../../utils/utils';
import { DragState } from '../../../types/enums';
import { type ButtonsController } from './buttonsController';
import { Placeholder } from '../../../components/placeholder/placeholder';

export class DragController {
  private view: GamePageView;
  private buttonsController: ButtonsController;

  constructor(view: GamePageView, buttonsController: ButtonsController) {
    this.view = view;
    this.buttonsController = buttonsController;
  }

  public bindStaticListeners(): void {
    this.view.getGamePage().addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
    });
    this.view.getGamePage().addEventListener('drop', (e: DragEvent) => this.handleForbiddenDrag(e));
  }

  private handleForbiddenDrag(e: DragEvent): void {
    const wordId = isNotNullable(e.dataTransfer).getData('text');
    const word = isNotNullable(this.view.words.find(el => el.id === wordId));
    word.removeDragStyle();
  }

  public bindDragListeners(): void {
    this.view.resultRow.addEventListener('dragover', e => {
      this.handleDragOver(e as DragEvent);
    });

    this.view.resultRow.addEventListener('drop', e => {
      this.handleDragEnd(e as DragEvent, DragState.toResults);
    });

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
    const word = isNotNullable(this.view.words.find(el => el.id === wordId));
    const dragWordsInSource = isNotNullable(word.getComponent().parentElement).classList.contains('words');
    const dragWordsInResults = isNotNullable(word.getComponent().parentElement).classList.contains('game-results-row');

    if (dragState === DragState.toResults && !dragWordsInResults) {
      this.dragToResult(word, checkEventTarget(e.target), e);
    } else if (dragState === DragState.toResults && dragWordsInResults) {
      this.dragInResult(word, checkEventTarget(e.target), e);
    } else if (dragState === DragState.toSource && !dragWordsInSource) {
      this.dragToSource(word);
    }

    this.buttonsController.setStateCheckButton();
    word.removeDragStyle();
  }

  public dragToResult(word: Word, replacedElement: HTMLElement, e: DragEvent): void {
    if (!replacedElement.classList.contains('word')) {
      const indexPlaceholder = this.view.resultWords.findIndex(
        el => el.id === replacedElement.id && el instanceof Placeholder
      );

      this.view.placeholders.push(this.view.resultWords[indexPlaceholder]);
      this.view.resultWords[indexPlaceholder] = word;

      replacedElement.replaceWith(word.getComponent());
    } else {
      const indexReplacedElement = this.view.resultWords.findIndex(el => el?.id === replacedElement.id);

      if (e.clientX > replacedElement.getBoundingClientRect().left + replacedElement.offsetWidth / 2) {
        isNotNullable(replacedElement.parentNode).insertBefore(word.getComponent(), replacedElement.nextSibling);
        this.view.resultWords.splice(indexReplacedElement + 1, 0, word);
      } else {
        isNotNullable(replacedElement.parentNode).insertBefore(word.getComponent(), replacedElement);
        this.view.resultWords.splice(indexReplacedElement, 0, word);
      }

      const placeholderIndex = this.view.resultWords.findLastIndex(el => el instanceof Placeholder);
      const placeholder = this.view.resultWords.splice(placeholderIndex, 1)[0];
      this.view.placeholders.push(this.view.resultWords.splice(placeholderIndex, 1)[0]);
      placeholder.getComponent().remove();
    }
  }

  public dragToSource(word: Word): void {
    const placeholder = isNotNullable(this.view.placeholders.pop());

    word.getComponent().insertAdjacentElement('beforebegin', placeholder.getComponent());
    this.view.sourceElement.append(word.getComponent());

    const index = this.view.resultWords.findIndex(el => el === word);
    this.view.resultWords[index] = placeholder;
  }

  private dragInResult(word: Word, replacedElement: HTMLElement, e: DragEvent): void {
    this.view.resultWords = this.view.resultWords.filter(el => el !== word);
    const indexReplacedElement = this.view.resultWords.findIndex(el => el?.id === replacedElement.id);

    if (e.clientX > replacedElement.getBoundingClientRect().left + replacedElement.offsetWidth / 2) {
      isNotNullable(replacedElement.parentNode).insertBefore(word.getComponent(), replacedElement.nextSibling);
      this.view.resultWords.splice(indexReplacedElement + 1, 0, word);
    } else {
      isNotNullable(replacedElement.parentNode).insertBefore(word.getComponent(), replacedElement);
      this.view.resultWords.splice(indexReplacedElement, 0, word);
    }
  }
}
