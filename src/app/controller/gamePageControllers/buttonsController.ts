import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { ButtonState } from '../../../types/enums';
import { Word } from '../../../components/word/word';
import { type HintsController } from './hintsController';
import { type DataService } from '../../../services/data.service';

export class ButtonsController {
  private view: GamePageView;
  private hintsController: HintsController;
  private dataController: DataService;

  constructor(view: GamePageView, dataController: DataService, hintsController: HintsController) {
    this.view = view;
    this.dataController = dataController;
    this.hintsController = hintsController;
  }

  public bindButtonsListeners(callback: () => void): void {
    this.view.buttonController.getComponent().addEventListener('click', () => {
      this.view.words.forEach(word => word.removeState());
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

    for (let i = 0; i < this.dataController.correctSentence.length; i += 1) {
      const wordValue = this.view.resultWords[i];
      if (wordValue instanceof Word) {
        const isValid = this.dataController.correctSentence[i] === wordValue.value;

        if (!isValid) {
          resultBlockState = false;
        }

        wordValue.checkState(isValid);
      }
    }

    if (resultBlockState) {
      this.view.blockPreviousSentence();
      this.hintsController.setTranslationRow(true);
      this.hintsController.setPlayButton(true);
      this.hintsController.setWordsBackground(true);
      this.changeButtons(true);
    }
  }

  private handleAutoComplete(): void {
    this.view.resultRow.replaceChildren();

    for (let i = 0; i < this.view.wordsRightOrder.length; i += 1) {
      this.view.resultRow.append(this.view.wordsRightOrder[i].getComponent());
      this.view.wordsRightOrder[i].removeState();
      this.view.resultWords[i] = this.view.wordsRightOrder[i];
    }

    this.view.buttonAutoComplete.disableButton();
    this.setStateCheckButton();
    this.view.blockPreviousSentence();
    this.view.buttonController.getComponent().click();
  }
}
