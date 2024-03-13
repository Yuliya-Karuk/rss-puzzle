// import { Word } from '../../../components/word/word';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { ButtonState } from '../../../types/enums';
import { Word } from '../../../components/word/word';

export class ButtonsController {
  private view: GamePageView;
  private correctSentence: string[];

  constructor(view: GamePageView) {
    this.view = view;
  }

  public setCorrectSentence(correctSentence: string[]): void {
    this.correctSentence = correctSentence;
  }

  public bindButtonsListeners(callback: () => void): void {
    this.view.buttonController.getComponent().addEventListener('click', () => {
      if (this.view.buttonController.state === ButtonState.check) {
        this.checkSentence();
      } else {
        callback();
      }
    });

    this.view.buttonAutoComplete.getComponent().addEventListener('click', () => this.handleAutoComplete());
  }

  public setStateCheckButton(): void {
    const makeButtonActive = this.checkResultIsCompleted();

    if (makeButtonActive) {
      this.view.buttonController.enableButton();
      return;
    }

    this.view.buttonController.disableButton();
  }

  private checkResultIsCompleted(): boolean {
    return this.view.resultWords.every(el => el instanceof Word);
  }

  public changeButtons(state: boolean): void {
    if (state) {
      this.view.buttonController.setContinueState();
    } else {
      this.view.buttonController.setCheckState();
    }
  }

  private checkSentence(): void {
    let resultBlockState = true;

    for (let i = 0; i < this.correctSentence.length; i += 1) {
      const wordValue = this.view.resultWords[i];
      if (wordValue instanceof Word) {
        const isValid = this.correctSentence[i] === wordValue.value;

        if (!isValid) {
          resultBlockState = false;
        }

        wordValue.checkState(isValid);
      }
    }

    if (resultBlockState) {
      this.changeButtons(true);
      this.view.blockPreviousSentence();
    }
  }

  private handleAutoComplete(): void {
    this.view.resultRow.replaceChildren();

    for (let i = 0; i < this.view.wordsRightOrder.length; i += 1) {
      this.view.resultRow.append(this.view.wordsRightOrder[i].getComponent());
      this.view.resultWords[i] = this.view.wordsRightOrder[i];
    }

    this.view.buttonAutoComplete.disableButton();
    this.setStateCheckButton();
    this.view.blockPreviousSentence();
    this.view.buttonController.getComponent().click();
  }
}
