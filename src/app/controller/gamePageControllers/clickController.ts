import { Word } from '../../../components/word/word';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import type { ButtonsController } from './buttonsController';
import { ReplaceController } from './replaceController';

export class ClickController {
  private view: GamePageView;
  private buttonsController: ButtonsController;
  private replaceController: ReplaceController;

  constructor(view: GamePageView, buttonsController: ButtonsController, replaceController: ReplaceController) {
    this.view = view;
    this.buttonsController = buttonsController;
    this.replaceController = replaceController;
  }

  public bindWordListeners(): void {
    for (let i = 0; i < this.view.words.length; i += 1) {
      const item = this.view.wordsRightOrder[i].getComponent();

      item.addEventListener('click', () => {
        if (item.parentElement === this.view.sourceElement) {
          this.moveWordToResult(this.view.wordsRightOrder[i]);
        } else {
          this.moveWordToSource(this.view.wordsRightOrder[i]);
        }

        this.buttonsController.setStateCheckButton();
      });
    }
  }

  private findEmptySlot(destination: Element): number {
    const index = Array.from(destination.children).findIndex(el => el.className.includes('placeholder'));
    return index;
  }

  private moveWordToResult(word: Word): void {
    const placeholderIndex = this.findEmptySlot(this.view.resultRow);
    const placeholder = this.view.resultWords[placeholderIndex];
    const wordIndex = this.view.words.findIndex(el => el === word);

    this.replaceController.replacePlaceholderInResults(word, wordIndex, placeholder, placeholderIndex);
  }

  private moveWordToSource(word: Word): void {
    word.removeState();

    const placeholderIndex = this.findEmptySlot(this.view.sourceElement);
    const placeholder = this.view.words[placeholderIndex];
    const wordIndex = this.view.resultWords.findIndex(el => el === word);

    this.replaceController.replacePlaceholderInSource(word, wordIndex, placeholder, placeholderIndex);
  }
}
