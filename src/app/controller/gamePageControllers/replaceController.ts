import { Placeholder } from '../../../components/placeholder/placeholder';
import { Word } from '../../../components/word/word';
import { isNotNullable } from '../../../utils/utils';
import { type GamePageView } from '../../view/gamePageView/gamePageView';

export class ReplaceController {
  private view: GamePageView;

  constructor(view: GamePageView) {
    this.view = view;
  }

  public replacePlaceholderInResults(word: Word, wIndex: number, placeholder: Placeholder, pIndex: number): void {
    placeholder.getComponent().after(word.getComponent());
    if (wIndex !== 0) {
      this.view.sourceElement.children[wIndex - 1].after(placeholder.getComponent());
    } else {
      this.view.sourceElement.prepend(placeholder.getComponent());
    }

    this.view.resultWords[pIndex] = word;
    this.view.words[wIndex] = placeholder;
  }

  public replacePlaceholderInSource(word: Word, wIndex: number, placeholder: Placeholder, pIndex: number): void {
    placeholder.getComponent().after(word.getComponent());
    if (wIndex !== 0) {
      this.view.resultRow.children[wIndex - 1].after(placeholder.getComponent());
    } else {
      this.view.resultRow.prepend(placeholder.getComponent());
    }

    this.view.resultWords[wIndex] = placeholder;
    this.view.words[pIndex] = word;
  }

  public moveWordWithReplaceLastPlaceholder(
    e: DragEvent | Touch,
    word: Word,
    wIndex: number,
    movedWord: Word,
    movedIndex: number
  ): void {
    const movedElement = movedWord.getComponent();

    this.moveWordDrag(word, movedElement, movedIndex, e);

    const placeholderIndex = this.view.resultWords.findLastIndex(el => el instanceof Placeholder);
    const placeholder = this.view.resultWords.splice(placeholderIndex, 1)[0];

    if (wIndex !== 0) {
      this.view.sourceElement.children[wIndex - 1].after(placeholder.getComponent());
    } else {
      this.view.sourceElement.prepend(placeholder.getComponent());
    }

    this.view.words[wIndex] = placeholder;
  }

  public moveWordsInResults(word: Word, movedElement: HTMLElement, e: DragEvent | Touch): void {
    this.view.resultWords = this.view.resultWords.filter(el => el !== word);
    const movedIndex = this.view.resultWords.findIndex(el => el.getComponent() === movedElement);

    this.moveWordDrag(word, movedElement, movedIndex, e);
  }

  private moveWordDrag(
    word: Word,
    movedElement: HTMLDivElement | HTMLElement,
    movedIndex: number,
    e: DragEvent | Touch
  ): void {
    if (e.clientX > movedElement.getBoundingClientRect().left + movedElement.offsetWidth / 2) {
      isNotNullable(movedElement.parentNode).insertBefore(word.getComponent(), movedElement.nextSibling);
      this.view.resultWords.splice(movedIndex + 1, 0, word);
    } else {
      isNotNullable(movedElement.parentNode).insertBefore(word.getComponent(), movedElement);
      this.view.resultWords.splice(movedIndex, 0, word);
    }
  }
}
