import { Word } from '../../../components/word/word';
import { isNotNullable } from '../../../utils/utils';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import type { ButtonsController } from './buttonsController';

export class ClickController {
  private view: GamePageView;
  private buttonsController: ButtonsController;

  constructor(view: GamePageView, buttonsController: ButtonsController) {
    this.view = view;
    this.buttonsController = buttonsController;
  }

  public bindWordListeners(): void {
    for (let i = 0; i < this.view.words.length; i += 1) {
      const item = this.view.words[i].getComponent();

      item.addEventListener('click', () => {
        if (item.parentElement === this.view.sourceElement) {
          this.moveWordToResult(this.view.words[i]);
        } else {
          this.moveWordToSource(this.view.words[i]);
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
    const index = this.findEmptySlot(this.view.resultRow);
    const placeholder = this.view.resultWords[index];

    this.view.resultRow.children[index].replaceWith(word.getComponent());
    this.view.placeholders.push(placeholder);
    this.view.resultWords[index] = word;
  }

  private moveWordToSource(word: Word): void {
    word.removeState();

    const placeholder = isNotNullable(this.view.placeholders.pop());
    word.getComponent().insertAdjacentElement('beforebegin', placeholder.getComponent());

    this.view.sourceElement.append(word.getComponent());

    const index = this.view.resultWords.findIndex(el => el === word);
    this.view.resultWords[index] = placeholder;
  }
}
